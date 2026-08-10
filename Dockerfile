# Utiliser une image Java 21 JRE (le projet est compilé en Java 21)
FROM eclipse-temurin:21-jre-alpine

# Définir le dossier de travail
WORKDIR /app

# Copier spécifiquement le JAR exécutable complet sigrh_app.jar
COPY sigrh_app.jar app.jar

# Exposer le port du backend
EXPOSE 8081

# Lancer l'application Spring Boot en mode prod
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
