FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY target/demo-0.0.1-SNAPSHOT.jar app.jar
COPY .env .env
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]