package handlers

import (
	"github.com/google/uuid"
)

type CreateSecretParams struct {
	Message       string `json:"message"`
	DurationInMin int    `json:"durationInMinutes"`
}

type CreateSecretResponse struct {
	MessageID uuid.UUID `json:"messageId"`
}

type GetSecretResponse struct {
	Message string `json:"message"`
}

type CheckSecretResponse struct {
	SecretExists bool `json:"secretExists"`
}
