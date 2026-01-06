# =========================
# ETAPA 1: BUILD
# =========================
FROM maven:3.9.6-eclipse-temurin-17 AS build

# Evita problemas de encoding en Windows
ENV MAVEN_OPTS="-Dfile.encoding=UTF-8"

WORKDIR /app

# Copiamos primero el pom para cachear dependencias
COPY pom.xml ./
RUN mvn -B dependency:go-offline

# Copiamos el código fuente
COPY src ./src

# Compilamos el JAR
RUN mvn -B clean package -Dmaven.test.skip=true

# =========================
# ETAPA 2: RUNTIME
# =========================
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Copiamos el JAR generado
COPY --from=build /app/target/*.jar app.jar

# Puerto del backend
EXPOSE 8080

# Ejecutar Spring Boot
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
