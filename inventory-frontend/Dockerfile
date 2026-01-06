FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . /app
RUN npm run build -- --configuration production

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
RUN rm -f /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

# 🔥 COPIA TODO dist SIN ADIVINAR NOMBRE
COPY --from=build /app/dist/inventory-frontend/browser* /usr/share/nginx/html

EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]
