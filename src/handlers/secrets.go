package handlers

import (
	"net/http"
	"time"

	"github.com/google/uuid"
	"wildhaber.io/victoria/src/server"
	"wildhaber.io/victoria/src/service"
	"wildhaber.io/victoria/src/utils"
)

type CreateSecretParams struct {
	Message  string
	Duration time.Duration
}

type CreateSecretResponse struct {
	MessageID uuid.UUID
}

type GetSecretResponse struct {
	Message string
}

var SecretRoutes = []server.RouteTemplate{
	{Method: server.GET, Path: "/secrets/{secretID}", HandleFunction: GetSecret},
	{Method: server.POST, Path: "/secrets", HandleFunction: CreateSecret},
}

func GetSecret(w http.ResponseWriter, r *http.Request) *utils.ApiError {
	secretIDAsString := utils.FromParams(r, "secretID")

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

func CreateSecret(w http.ResponseWriter, r *http.Request) *utils.ApiError {

	createParams := CreateSecretParams{}
	utils.GetFromBody(r, &createParams)
	secretPath, ok := service.StoreSecret(createParams.Message, createParams.Duration)

	if !ok {
		return utils.InvalidRequest
	}

	utils.ReturnJson(w, CreateSecretResponse{secretPath})

	return nil
}
