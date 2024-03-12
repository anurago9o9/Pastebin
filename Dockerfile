FROM node:latest as build_stage

# select directory
WORKDIR /app

# copy files from host to docker container
ADD frontend/package.json .
RUN npm install

ADD frontend/ .

RUN npm run build




FROM node as deployment_stage

WORKDIR /app

ADD backend/ .
COPY --from=build_stage /app/build /app/frontend/dist

RUN npm install

CMD ["node", "server.js"]
