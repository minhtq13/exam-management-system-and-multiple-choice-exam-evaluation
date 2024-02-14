#! /bin/bash
# remove current container and image
docker rm -f elearning_support_backend
docker rmi elearning_support_backend:1.0.0
# build image
docker build -f ./Dockerfile --tag=elearning_support_backend:1.0.0 .
# run container
docker compose -f docker-compose-aws.yml up -d
# logs
docker logs -f elearning_support_backend --tail 500