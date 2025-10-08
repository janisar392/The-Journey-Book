# Use Maven with Java 22 to build the project
FROM maven:3.9-eclipse-temurin-22 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Use Java 22 runtime
FROM openjdk:22-slim
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]