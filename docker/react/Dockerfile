FROM node:lts-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Remplacer le fichier .env ou ajouter la variable d'environnement
ARG REACT_APP_URL_BACK
ENV REACT_APP_URL_BACK=${REACT_APP_URL_BACK}

RUN npm run build

FROM nginx:latest as prod
COPY --from=build /app/build /usr/share/nginx/html
COPY ./docker/react/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 3000/tcp

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
