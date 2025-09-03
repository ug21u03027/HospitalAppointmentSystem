# Build stage
FROM maven:3.9.11-eclipse-temurin-21 AS build
WORKDIR /app

# Copy only the backend project
COPY hospital-appointment-backend/pom.xml .
RUN mvn dependency:go-offline -B

COPY hospital-appointment-backend/src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/hospital-appointment-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
