# ===============================
# FASE 2: Servir con Nginx
# ===============================
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# 🔥 IMPORTANTE: apuntamos a browser
COPY --from=build /app/dist/EscosoftwareAngular/browser/ /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
