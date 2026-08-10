# Utiliser Node.js 20 sur Alpine
FROM node:20-alpine

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --legacy-peer-deps

# Copier le reste du code source
COPY . .

# Exposer le port 4200 de l'application Angular
EXPOSE 4200

# Démarrer le serveur Angular ouvert sur 0.0.0.0
CMD ["npm", "start"]
