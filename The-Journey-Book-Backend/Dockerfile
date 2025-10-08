# Use Java 22
FROM openjdk:22-slim

# Set working directory
WORKDIR /app

# Copy the JAR file (you'll need to build it first)
COPY target/*.jar app.jar

# Expose port 8080
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]