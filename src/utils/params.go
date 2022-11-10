package utils

import (
	"net/http"

	"github.com/gorilla/mux"
)

func FromParams(r *http.Request, paramName string) string {
	return mux.Vars(r)["secretID"]
}
