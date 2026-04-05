FROM gradle:8.14.3-jdk17 AS builder

WORKDIR /build
COPY . .
RUN gradle clean bootJar --no-daemon

FROM eclipse-temurin:17-jre

WORKDIR /app
COPY --from=builder /build/build/libs/*.jar app.jar

EXPOSE 8081

CMD [ "java", "-jar", "app.jar" ]