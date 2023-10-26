# Build command: docker build --tag=app20222_backend:1.0.0 .
# Maven build stage
FROM maven:3.8.1-jdk-11 AS build
COPY . .
RUN mvn clean package -Dprod -DskipTests

# Docker build image stage
FROM openjdk:11.0.16
MAINTAINER chiendao1808
ARG JAR_FILE=./target/*.jar
COPY --from=build ${JAR_FILE} e_learning_support_backend.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "e_learning_support_backend.jar"]
