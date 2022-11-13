package handlers

import (
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/julienschmidt/httprouter"
	"wildhaber.io/victoria/src/server"
	"wildhaber.io/victoria/src/service"
	"wildhaber.io/victoria/src/utils"
)

var SecretRoutes = []server.RouteTemplate{
	{Method: server.DELETE, Path: "/secrets/:secretID", HandleFunction: DeleteSecret},
	{Method: server.GET, Path: "/secrets/:secretID/check", HandleFunction: CheckSecret},
	{Method: server.GET, Path: "/secrets/:secretID", HandleFunction: GetSecret},
	{Method: server.POST, Path: "/secrets", HandleFunction: CreateSecret},
}

func GetSecret(w http.ResponseWriter, r *http.Request, p httprouter.Params) *utils.ApiError {
	secretIDAsString := p.ByName("secretID")

	secretID, err := uuid.Parse(secretIDAsString)
	if err != nil {
		return utils.ServerError
	}

	secret, loaded := service.RetrieveSecret(secretID)
	if !loaded {
		return utils.NotFound
	}
	utils.ReturnJson(w, GetSecretResponse{secret})
	return nil
}

func CreateSecret(w http.ResponseWriter, r *http.Request, p httprouter.Params) *utils.ApiError {

	createParams := CreateSecretParams{}
	utils.GetFromBody(r, &createParams)

	if createParams.DurationInMin > 10080 || createParams.DurationInMin < 5 {
		return utils.InvalidRequest
	}

	secretPath, ok := service.StoreSecret(createParams.Message, time.Duration(createParams.DurationInMin)*time.Minute)

	if !ok {
		return utils.InvalidRequest
	}

	utils.ReturnJson(w, CreateSecretResponse{secretPath})

	return nil
}

func DeleteSecret(w http.ResponseWriter, r *http.Request, p httprouter.Params) *utils.ApiError {
	secretIDAsString := p.ByName("secretID")

	secretID, err := uuid.Parse(secretIDAsString)
	if err != nil {
		return utils.ServerError
	}

	exists := service.CheckSecret(secretID)
	if !exists {
		return utils.NotFound
	}

	service.DeleteSecret(secretID)
	return nil
}

func CheckSecret(w http.ResponseWriter, r *http.Request, p httprouter.Params) *utils.ApiError {
	secretIDAsString := p.ByName("secretID")

	secretID, err := uuid.Parse(secretIDAsString)
	if err != nil {
		return utils.ServerError
	}

	exists := service.CheckSecret(secretID)
	utils.ReturnJson(w, CheckSecretResponse{exists})
	return nil
}
