# Usa la imagen oficial de Node.js como base
FROM node:18

# Instala json-server globalmente
RUN npm install -g json-server

# Crea y establece el directorio de trabajo
WORKDIR /app

# Copia el archivo db.json al contenedor
COPY db.json /app/db.json

# Copia los archivos de la aplicación web
COPY . /app

# Instala las dependencias para la aplicación web
WORKDIR /app/web
RUN npm install

# Expone los puertos necesarios
EXPOSE 3000
EXPOSE 3001

# Inicia json-server y la aplicación web
CMD ["sh", "-c", "json-server --watch /app/db.json --port 3001 & npm run dev"]
