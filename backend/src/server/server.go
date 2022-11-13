package server

import (
	"flag"
	"log"
	"net/http"

	"github.com/julienschmidt/httprouter"

	"wildhaber.io/victoria/src/utils"
)

var addr = flag.String("addr", "0.0.0.0:3765", "local http server")
var acceptedOrigins = utils.GetENV("ACCESS_CONTROL_ORIGIN", "http://0.0.0.0:3000")

type Server struct {
	router *httprouter.Router
}

type RouteTemplate struct {
	Method         HandlerMethod
	Path           string
	HandleFunction HandlerFunctionWithError
}

type HandlerFunctionWithError func(w http.ResponseWriter, r *http.Request, p httprouter.Params) *utils.ApiError

type HandlerMethod string

const (
	GET    HandlerMethod = "GET"
	POST   HandlerMethod = "POST"
	PUT    HandlerMethod = "PUT"
	DELETE HandlerMethod = "DELETE"
)

func NewServer() Server {
	server := Server{
		router: httprouter.New(),
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
		s.router.Handle(string(route.Method), route.Path, ErrorHandlerAndCorsRoute(route.HandleFunction))
	}
	s.router.GlobalOPTIONS = http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", acceptedOrigins)
		// Adjust status code to 204
		w.WriteHeader(http.StatusNoContent)
	})
}

func ErrorHandlerAndCorsRoute(fn HandlerFunctionWithError) httprouter.Handle {
	return func(w http.ResponseWriter, r *http.Request, p httprouter.Params) {
		w.Header().Set("Access-Control-Allow-Origin", acceptedOrigins)

		err := fn(w, r, p)
		if err != nil {
			w.WriteHeader(err.Status)
			utils.ReturnJson(w, err)
		}
	}
}
