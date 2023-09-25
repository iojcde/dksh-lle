//go:generate go run github.com/steebchen/prisma-client-go generate

package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/docker/docker/api/types"
	"github.com/gorilla/websocket"
	prisma "github.com/iojcde/dksh-lle/web-terminal-server/prisma/db"
	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

var (
	upgrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			origin := r.Header.Get("Origin")
			return origin == "http://localhost:3000"

		},
	}
)

type SessionToken struct {
	Id      uint32 `json:"id"`
	Name    string `json:"name"`
	Email   string `json:"email"`
	Picture string `json:"picture"`
	Exp     uint32 `json:"exp"`
}

const messageByte byte = 'm'
const resizeByte byte = 'r'

type resizeMessage struct {
	Height uint `json:"height"`
	Width  uint `json:"width"`
}

var ctx = context.Background()
var db = prisma.NewClient()

func terminalProxy(c echo.Context) error {

	sess, err := getSession(c)
	if err != nil {
		return err
	}

	user, err := db.User.FindUnique(prisma.User.Email.Equals(sess.Email)).Exec(ctx)
	if err != nil {
		return err
	}

	if user == nil {
		return echo.ErrUnauthorized
	}

	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}

	defer ws.Close()

	cli, err := GetDockerClient()
	if err != nil {
		return err
	}

	defer cli.Close()

	id := c.Request().URL.Query().Get("id")
	if id == "" {
		return echo.NewHTTPError(400, "id is required")
	}
	println(id)

	containerConn, err := cli.ContainerAttach(ctx, id, types.ContainerAttachOptions{
		Stderr: true,
		Stdout: true,
		Stdin:  true,
		Stream: true,
	})
	if err != nil {
		log.Fatalf("attach error: %v", err)
	}
	var wg sync.WaitGroup

	wg.Add(1)
	go func() {
		buf := make([]byte, 1024)
		for {
			n, err := containerConn.Reader.Read(buf)
			if err != nil {
				log.Printf("read error: %v", err)
				break
			}
			err = ws.WriteMessage(websocket.BinaryMessage, buf[:n])
			if err != nil {
				log.Printf("write error: %v", err)
				break
			}
		}
	}()

	go func() {
		defer wg.Done()
		for {
			_, rawMsg, err := ws.ReadMessage()
			if err != nil {
				log.Printf("read ws error: %v", err)
				break
			}

			if len(rawMsg) != 0 {
				msgType := rawMsg[0]
				msg := rawMsg[1:]

				if msgType == messageByte {
					_, err = containerConn.Conn.Write(msg)
					if err != nil {
						log.Printf("write error: %v", err)
						break
					}
				}

				if msgType == resizeByte {
					if err != nil {
						log.Printf("read error: %v", err)
						break
					}
					size := resizeMessage{}

					json.Unmarshal(msg, &size)
					if err != nil {
						log.Printf("resize error: %v", err)
						break
					}

					err = cli.ContainerResize(ctx, id, types.ResizeOptions{
						Height: size.Height,
						Width:  size.Width,
					})
					if err != nil {
						log.Printf("resize error: %v", err)
						break
					}

				}

			}

		}
	}()

	wg.Wait()
	defer containerConn.Close()

	return nil

}

func main() {

	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	db.Connect()
	defer func() {
		if err := db.Prisma.Disconnect(); err != nil {
			panic(err)
		}
	}()

	e := echo.New()
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.GET("/ws", terminalProxy)
	e.Static("/", "./public")
	e.Logger.Fatal(e.Start("127.0.0.1:1323"))
}
