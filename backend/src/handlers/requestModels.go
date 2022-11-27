package handlers

import (
	"time"

	"github.com/google/uuid"
)

type CreateSecretParams struct {
	Message       string `json:"message"`
	DurationInMin int    `json:"durationInMinutes"`
	IsEncrypted   bool   `json:"isEncrypted"`
}

type CreateSecretResponse struct {
	MessageID uuid.UUID `json:"messageId"`
}

type GetSecretResponse struct {
	Message string `json:"message"`
}

type CheckSecretResponse struct {
	IsEncrypted      bool          `json:"isEncrypted"`
	TimeToExpiration time.Duration `json:"timeToExpiration"`
}
