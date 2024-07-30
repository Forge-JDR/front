FROM node:lts-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .
RUN rm -rf .env
ENV REACT_APP_URL_BACK=https://backforgejdryr5nsvrg-container-back-forge-jdr.functions.fnc.fr-par.scw.cloud/api
RUN npm run build

FROM nginx:latest as prod
ARG REACT_APP_URL_BACK
COPY --from=build /app/build /usr/share/nginx/html
COPY ./docker/react/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000/tcp

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]