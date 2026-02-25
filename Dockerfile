# ---- Etape 1 : Build ----
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY public/ public/
COPY src/ src/

RUN npm run build

# ---- Etape 2 : Servir avec nginx ----
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

# SPA : renvoyer index.html pour toutes les routes
RUN printf 'server {\n\
  listen 80;\n\
  root /usr/share/nginx/html;\n\
  index index.html;\n\
  location / {\n\
    try_files $uri $uri/ /index.html;\n\
  }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
