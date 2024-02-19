FROM node:17.9.1-alpine as build
MAINTAINER chiendao1808
WORKDIR /usr/local/app
ARG WORK_DIR=/usr/local/app
COPY package*.json ${WORK_DIR}
COPY yarn*.lock ${WORK_DIR}
RUN yarn install
COPY . .
RUN yarn build
EXPOSE 3000
ENTRYPOINT ["yarn", "start"]


