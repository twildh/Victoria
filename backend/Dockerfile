FROM golang:alpine3.16 as build

WORKDIR /app

COPY go.* ./
RUN go mod download

COPY . .

# Build the binary.
RUN go build -v -o /victoria src/*.go

FROM alpine:3.16

ARG ACCESS_CONTROL_ORIGIN

ENV ACCESS_CONTROL_ORIGIN=$ACCESS_CONTROL_ORIGIN

RUN apk --update add ca-certificates

WORKDIR /app

COPY --from=build /victoria /

RUN chmod +x /victoria

RUN ls -a

EXPOSE 3765

CMD ["/victoria"]

