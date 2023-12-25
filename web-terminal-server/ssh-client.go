package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/docker/cli/cli/connhelper"
	"github.com/docker/docker/client"
	"github.com/sfreiberg/simplessh"
)

func GetDockerClient() (*client.Client, error) {

	helper, err := connhelper.GetConnectionHelper("ssh://ubuntu@3.36.126.112:22")

	if err != nil {
		return nil, err
	}

	httpClient := &http.Client{
		// No tls
		// No proxy
		Transport: &http.Transport{
			DialContext: helper.Dialer,
		},
	}

	var clientOpts []client.Opt

	clientOpts = append(clientOpts,
		client.WithHTTPClient(httpClient),
		client.WithHost(helper.Host),
		client.WithDialContext(helper.Dialer),
	)

	version := os.Getenv("DOCKER_API_VERSION")

	if version != "" {
		clientOpts = append(clientOpts, client.WithVersion(version))
	} else {
		clientOpts = append(clientOpts, client.WithAPIVersionNegotiation())
	}

	cl, err := client.NewClientWithOpts(clientOpts...)

	if err != nil {
		fmt.Println("Unable to create docker client")
		panic(err)
	}

	return cl, nil
}

func SshAndKillProc(pid int) error {
	var client *simplessh.Client
	var err error

	if client, err = simplessh.ConnectWithKeyFile("3.36.126.112", "ubuntu", "C:\\Users\\jcde0\\.ssh\\id_ed25519"); err != nil {
		return err
	}

	defer client.Close()

	// Now run the commands on the remote machine:
	if _, err := client.Exec(fmt.Sprintf("kill %d", pid)); err != nil {
		log.Println(err)
	} else {

	}

	return nil
}
