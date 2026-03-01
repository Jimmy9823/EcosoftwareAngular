# ===============================
# FASE 1: Build Angular
# ===============================
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build correcto especificando proyecto
RUN npx ng build EscosoftwareAngular --configuration production


# ===============================
# FASE 2: Servir con Nginx
# ===============================
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/EscosoftwareAngular /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
