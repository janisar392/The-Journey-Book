# Build Stage
FROM maven:3.9-eclipse-temurin-22 AS builder
WORKDIR /app
COPY . .
RUN mvn -q -e -DskipTests package

# Runtime Stage
FROM eclipse-temurin:22-jre
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
