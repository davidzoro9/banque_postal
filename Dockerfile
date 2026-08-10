# Utiliser une image légère avec Java 21 JRE
FROM eclipse-temurin:21-jre-alpine

# Définir le dossier de travail
WORKDIR /app

# Copier le fichier JAR (compatible si à la racine ou dans target/)
COPY *.jar app.jar

# Exposer le port du backend
EXPOSE 8081

# Variables d'environnement configurables lors du démarrage du conteneur
ENV DB_HOST=postgres \
    DB_PORT=5432 \
    DB_NAME=sigrh_db \
    DB_USER=postgres \
    DB_PASSWORD=1234 \
    PORT=8081

# Commande pour démarrer l'application Java
ENTRYPOINT ["java", "-jar", "app.jar"]
