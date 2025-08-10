# Stage 1: Build the application using Maven and Java 21
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY ./pom.xml .
COPY ./src ./src
RUN mvn clean install -DskipTests

# Stage 2: Create the final, lightweight image to run the application
FROM openjdk:21-slim
WORKDIR /app
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar ./app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]