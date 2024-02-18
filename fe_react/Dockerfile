FROM node:14.17.6-alpine as build
MAINTAINER chiendao1808
WORKDIR /usr/local/app
ARG WORK_DIR=/usr/local/app
COPY package*.json ${WORK_DIR}
COPY yarn*.lock ${WORK_DIR}
RUN npm install
COPY . .
RUN npm build
EXPOSE 3000
ENTRYPOINT ["npm", "start"]


