#!/bin/bash
docker-compose stop
PROJECT_NAME="fastify-api"

docker-compose -f docker-compose.yaml -p $PROJECT_NAME --verbose up --build
