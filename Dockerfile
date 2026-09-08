FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY sigrh_app.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]
