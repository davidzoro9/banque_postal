# Etape 1: Compiler l'application Angular
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build -- --configuration=production

# Etape 2: Servir avec Nginx
FROM nginx:stable-alpine
COPY --from=build /app/dist/hr-management/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
