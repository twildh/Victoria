# Victoria - Frontend

The victoria frontend is here to act as the main way to access the server. It's easy to use interface allows for an easier secret sending.

This frontend was build with solid and npm.

## Dev Usage

To start a dev server run:

```bash
$ npm install
$ npm run dev
```

Requests to the backend go via the vite proxy setup.

## Building the project

```bash
$ npm install
$ npm build
```

## Docker scripts

You can build a docker image with the given docker scripts. The docker file will include an nginx instance to server the static site.

```bash
$ ./scripts/docker.build.sh
```
