# Build command: docker build --tag=elearning_support_be:1.0.0 .
# Maven build stage
FROM maven:3.8.1-jdk-11 AS build
COPY . .
RUN mvn dependency:purge-local-repository -DactTransitively=false -DreResolve=false
RUN mvn clean package -Dprod -DskipTests

# Docker build image stage
FROM openjdk:11.0.16
MAINTAINER chiendao1808
WORKDIR /usr/local/app
ADD src ./src
ARG JAR_FILE=./target/*.jar
ARG WORK_DIR=/usr/local/app
COPY --from=build ${JAR_FILE} ${WORK_DIR}/e_learning_support_backend.jar
EXPOSE 8088
ENTRYPOINT ["java", "-jar", "e_learning_support_backend.jar"]
