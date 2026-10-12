# syntax=docker/dockerfile:1
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=secret,id=proxy_ca \
    sh -c 'if [ -f /run/secrets/proxy_ca ]; then export NODE_EXTRA_CA_CERTS=/run/secrets/proxy_ca; fi; npm ci --no-audit --no-fund'
COPY . .
ARG REACT_APP_URL_BACK
ENV REACT_APP_URL_BACK=${REACT_APP_URL_BACK}
RUN test -n "$REACT_APP_URL_BACK" && npm run build
FROM nginx:1.28-alpine AS production
COPY --from=build /app/build /usr/share/nginx/html
COPY docker/react/nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
