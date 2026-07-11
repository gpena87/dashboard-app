FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY . .

# Build de la aplicación Angular
RUN npm run build

# Etapa final - servir la aplicación
FROM node:20-alpine

WORKDIR /app

# Instalar solo dependencias de producción
COPY package*.json ./
RUN npm ci --only=production && npm install express

# Copiar el servidor
COPY server.js ./

# Copiar los archivos compilados desde la etapa builder
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "server.js"]
