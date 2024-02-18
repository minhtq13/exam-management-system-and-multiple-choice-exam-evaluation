#! /bin/bash
# remove current container and image
docker rm -f elearning_support_fe
docker rmi leopepe2012/elearning_support_fe:latest
# rebuild image
docker build -f ./Dockerfile --tag=leopepe2012/elearning_support_fe:latest .
# run the container using docker-compose
docker compose -f docker-compose-local.yml up -d
# view logs after running the container
docker logs -f elearning_support_fe --tail 500