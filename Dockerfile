# Usar imagen base de Node.js
FROM node:18-alpine

# Establecer directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias (incluye devDependencies para permitir nodemon en desarrollo)
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Copiar el resto de la aplicación
COPY . .

# Exponer el puerto
EXPOSE 3000

# Variable de entorno por defecto
ENV NODE_ENV=production

# Comando para iniciar la aplicación en producción
CMD ["npm", "start"]
