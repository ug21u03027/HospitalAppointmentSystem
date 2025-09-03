FROM maven:3.9.11-eclipse-temurin-21 AS build
COPY . .
RUN mvn clean package -DskipTests
FROM eclipse-temurin:21-jdk-jammy
COPY --from=build /target/hospital-appointment-backend-0.0.1-SNAPSHOT.jar hospital-appointment-backend.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","hospital-appointment-backend.jar"]