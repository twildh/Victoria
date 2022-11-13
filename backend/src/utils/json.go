package utils

import (
	"encoding/json"
	"net/http"
)

func ReturnJson(w http.ResponseWriter, i interface{}) {
	json.NewEncoder(w).Encode(i)
}

func GetFromBody(req *http.Request, i interface{}) error {
	err := json.NewDecoder(req.Body).Decode(i)
	return err
}

type ApiError struct {
	Message string
	Status  int
}

var (
	NotFound       *ApiError = &ApiError{"Not found", http.StatusNotFound}
	InvalidRequest *ApiError = &ApiError{"Invalid request", http.StatusBadRequest}
	ServerError    *ApiError = &ApiError{"Server went whoops", http.StatusInternalServerError}
)
