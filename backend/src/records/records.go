package records

import (
	"sync"
	"time"

	"github.com/google/uuid"
)

type Duration string

type Record struct {
	message     string
	expireOn    time.Time
	isEncrypted bool
}

type RecordMap struct {
	storeMap sync.Map
}

type SecretInfo struct {
	ExpireOn    time.Time
	IsEncrypted bool
}

type Secret struct {
	Message     string
	IsEncrypted bool
}

func (r *RecordMap) StoreRecord(ID uuid.UUID, message string, duration time.Duration, isEncrypted bool) {
	r.storeMap.Store(ID.String(), Record{message: message, expireOn: time.Now().Add(duration), isEncrypted: isEncrypted})
}

func (r *RecordMap) GetSecretStats(id uuid.UUID) (info *SecretInfo) {
	record, exists := r.storeMap.Load(id.String())
	if rec, ok := record.(Record); exists && ok && rec.expireOn.After(time.Now()) {
		return &SecretInfo{rec.expireOn, rec.isEncrypted}
	}
	return nil
}

func (r *RecordMap) CheckIfEntryExists(id uuid.UUID) bool {
	_, exists := r.storeMap.Load(id.String())
	return exists
}

func (r *RecordMap) RemoveExpiredRecord() {
	r.storeMap.Range(func(key, value interface{}) bool {

		if rec, ok := value.(Record); ok &&
			rec.expireOn.Before(time.Now()) {
			r.storeMap.Delete(key)
		}
		return true
	})
}

func (r *RecordMap) LoadRecord(ID uuid.UUID) (string, bool) {
	val, loaded := r.storeMap.LoadAndDelete(ID.String())

	if !loaded {
		return "", false
	}

	if rec, ok := val.(Record); ok || rec.expireOn.After(time.Now()) {
		return rec.message, true
	}
	return "", false
}

func (r *RecordMap) RemoveRecord(ID uuid.UUID) {
	r.storeMap.Delete(ID.String())
}
