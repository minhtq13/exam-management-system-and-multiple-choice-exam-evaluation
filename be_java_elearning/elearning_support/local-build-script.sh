#! /bin/bash
# remove current container and image
docker rm -f elearning_support_backend
docker rmi elearning_support_backend:1.0.0
# rebuild image
docker build -f ./Dockerfile --tag=elearning_support_backend:1.0.0 .
# run the container using docker-compose
docker compose -f docker-compose-local.yml up -d
# view logs after running the container
docker logs -f elearning_support_backend --tail 500