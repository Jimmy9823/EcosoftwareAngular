# -------- ETAPA 1: BUILD ANGULAR --------
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build


# -------- ETAPA 2: NGINX --------
FROM nginx:alpine

# 🔥 IMPORTANTE: ruta del build de Angular
COPY --from=build /app/dist/ecosoftware-angular/browser/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
