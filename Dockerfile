# ===============================
# FASE 1: Build Angular
# ===============================
FROM node:20-alpine AS build

WORKDIR /app

# Copiar dependencias
COPY package*.json ./
RUN npm install

# Copiar proyecto completo
COPY . .

# Build en modo producción
RUN npm run build --configuration production


# ===============================
# FASE 2: Servir con Nginx
# ===============================
FROM nginx:alpine

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build generado
COPY --from=build /app/dist/EscosoftwareAngular /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
