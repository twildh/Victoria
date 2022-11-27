package service

import (
	"flag"
	"log"
	"time"

	"github.com/google/uuid"
	"wildhaber.io/victoria/src/records"
)

var verbose = flag.Bool("verbose", false, "log events")
var recordings records.RecordMap

func Init() {
	ticker := time.NewTicker(time.Minute)
	go func() {
		for range ticker.C {
			if *verbose {
				log.Println("Removing expired keys")
			}
			recordings.RemoveExpiredRecord()
		}
	}()
}

func StoreSecret(message string, duration time.Duration, isEncrypted bool) (uuid.UUID, bool) {

	durationInNanos := duration.Nanoseconds()
	if len(message) == 0 || durationInNanos > time.Hour.Nanoseconds()*24*7 ||
		durationInNanos < time.Minute.Nanoseconds()*5 {
		return uuid.Nil, false
	}

	keyAlreadyExists := true
	var id uuid.UUID

	for keyAlreadyExists {
		id = uuid.New()
		keyAlreadyExists = recordings.CheckIfEntryExists(id)
	}

	recordings.StoreRecord(id, message, duration, isEncrypted)
	return id, true
}

func RetrieveSecret(id uuid.UUID) (string, bool) {
	return recordings.LoadRecord(id)
}

func GetSecretStats(id uuid.UUID) *records.SecretInfo {
	return recordings.GetSecretStats(id)
}

func CheckSecret(id uuid.UUID) bool {
	return recordings.CheckIfEntryExists(id)
}

func DeleteSecret(id uuid.UUID) {
	recordings.RemoveRecord(id)
}
