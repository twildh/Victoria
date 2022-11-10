package records

import (
	"sync"
	"time"

	"github.com/google/uuid"
)

type Duration string

type Record struct {
	message  string
	expireOn time.Time
}

type RecordMap struct {
	storeMap sync.Map
}

func (r *RecordMap) StoreRecord(ID uuid.UUID, message string, duration time.Duration) {
	r.storeMap.Store(ID.String(), Record{message: message, expireOn: time.Now().Add(duration)})
}

func (r *RecordMap) CheckIfEntryExists(id uuid.UUID) bool {
	_, exists := r.storeMap.Load(id.String())
	return exists
}

func (r *RecordMap) RemoveExpiredRecord() {
	r.storeMap.Range(func(key, value interface{}) bool {

		if rec, ok := value.(Record); ok {
			if rec.expireOn.After(time.Now()) {
				r.storeMap.Delete(key)
			}
		}
		return true
	})
}

func (r *RecordMap) LoadRecord(ID uuid.UUID) (string, bool) {
	val, loaded := r.storeMap.LoadAndDelete(ID.String())

	if !loaded {
		return "", loaded
	}

	if rec, ok := val.(Record); ok {
		return rec.message, true
	}
	return "", false
}

func (r *RecordMap) RemoveRecord(ID uuid.UUID) {
	r.storeMap.Delete(ID.String())
}
