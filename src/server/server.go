package server

import (
	"flag"
	"log"
	"net/http"

	"github.com/gorilla/mux"
	"wildhaber.io/victoria/src/utils"
)

var addr = flag.String("addr", "0.0.0.0:3765", "local http server")

type Server struct {
	router *mux.Router
}

type RouteTemplate struct {
	Method         HandlerMethod
	Path           string
	HandleFunction HandlerFunctionWithError
}

type HandlerFunctionWithError func(w http.ResponseWriter, r *http.Request) *utils.ApiError

type HandlerMethod string

const (
	GET    HandlerMethod = "GET"
	POST   HandlerMethod = "POST"
	PUT    HandlerMethod = "PUT"
	DELETE HandlerMethod = "DELETE"
)

func NewServer() Server {
	server := Server{
		router: mux.NewRouter(),
	}

	return server
}

func (s *Server) Start() {
	log.Println("Listening to", *addr)
	log.Fatal(http.ListenAndServe(*addr, s.router))
	log.Println("Stop Listening to ", addr)
}

func (s *Server) RegisterRoutes(routes []RouteTemplate) {
	for _, route := range routes {
		s.router.Handle(route.Path, handleErrorsOnRoute(route.HandleFunction)).Methods(string(route.Method))
	}
}

func handleErrorsOnRoute(fn HandlerFunctionWithError) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err := fn(w, r)
		if err != nil {
			w.WriteHeader(err.Status)
			utils.ReturnJson(w, err)
		}
	}
}
