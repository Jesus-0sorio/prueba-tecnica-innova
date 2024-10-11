# Establece la imagen base
FROM node:20-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia el package.json y el package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias de producción
RUN npm install

# Copia todo el código de la aplicación al contenedor
COPY . .

# Compila la aplicación NestJS para producción
RUN npm run build

# Etapa de producción
FROM node:20-alpine AS production

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copia las dependencias instaladas y la compilación desde la etapa anterior
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

# Establece la variable de entorno para el entorno de producción
ENV NODE_ENV=production

# Expone el puerto en el que la aplicación se ejecutará
EXPOSE 3001

# Inicia la aplicación
CMD ["node", "dist/main"]
