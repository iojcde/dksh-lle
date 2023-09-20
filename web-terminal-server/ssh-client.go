package main

import (
	"fmt"
	"net/http"
	"os"

	"github.com/docker/cli/cli/connhelper"
	"github.com/docker/docker/client"
)

func GetDockerClient() (*client.Client, error) {

	helper, err := connhelper.GetConnectionHelper("ssh://ubuntu@3.38.207.235:22")

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
