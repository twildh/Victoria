# Victoria - Backend

The victoria backend is holding the actual information about the secrets to be exchanged. I stores them in a synced map that only allows access once.

The backend was built completely with golang and should be cross-platform compatible if needed.

## Dev Usage

To start a dev server run:

```bash
$ go mod download
$ go run ./...
```

Requests to the backend go via the vite proxy setup.

## Building the project

For your local platform run:

```bash
$ go build *.go
```

If you want to compile the app for another OS you can always have a look at the golang compilation guide

## Docker scripts

You can build a docker image with the given docker scripts. In case you want to avoid cors requests, I'd recommend tweaking the script a little for the environment variables.
Run the bash file with:

```bash
$ ./scripts/docker.build.sh
```
