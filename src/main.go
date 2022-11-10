package main

import (
	"flag"

	"wildhaber.io/victoria/src/handlers"
	"wildhaber.io/victoria/src/server"
	"wildhaber.io/victoria/src/service"
)

func main() {

	flag.Parse()
	service.Init()

	server := server.NewServer()

	server.RegisterRoutes(handlers.SecretRoutes)

	server.Start()
}
