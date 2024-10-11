# Prueba Tecnica Full Stack

## Descripción del Proyecto

Esta aplicación web de gestión de proyectos permite a los usuarios crear y gestionar proyectos, asignar tareas y hacer seguimiento del progreso del trabajo. La aplicación incluye un sistema de autenticación y permisos para asegurar que las acciones de los usuarios sean apropiadas según su rol.


## Tecnologías Utilizadas

- **Frontend**: Next.js con Material-UI
- **Backend**: NestJS (Dockerizado)
- **Base de Datos**: PostgreSQL (Dockerizado)
- **Autenticación**: JWT
- **Docker**: Para contenerización del backend y la base de datos

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) y [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)


## Configuración del Entorno

1. **Clona el repositorio**:

   ```bash
   git clone https://github.com/Jesus-0sorio/prueba-tecnica-innova.git
   cd prueba-tecnica-innova
   

2. **Configura las variables de entorno para el frontend:**

  Revisa si esta el achivo .env en la carpeta de Next.js (frontend), sino crea el archivo y agrega la siguiente configuración:

  ```bash
  NEXT_PUBLIC_API_URL=http://localhost:3001  # URL del backend NestJS en Docker
  ```

3. **Configura las variables de entorno para el frontend:**

   Si quieres cambiar el puerto de la aplicacion backend o de la base de datos entra al archivo de docker-compose.yml 
   ```yml
   version: '3.8'
    services:
      postgres:
        image: postgres:14-alpine
        container_name: postgres
        environment:
          POSTGRES_USER: nestuser
          POSTGRES_PASSWORD: nestpassword
          POSTGRES_DB: nestdb
        volumes:
          - postgres_data:/var/lib/postgresql/data
        ports:
          - '5432:5432' #Puerto que expone la base de datos para poder conectarse

      nest-app:
        build:
          context: ./back-innova/
          dockerfile: Dockerfile
        container_name: nest-app
        ports:
          - '3001:3001'
        environment:
          DATABASE_HOST: postgres
          DATABASE_PORT: 5432 #Puerto donde se conecta el backend a la base de datos
          DATABASE_USER: nestuser
          DATABASE_PASSWORD: nestpassword
          DATABASE_NAME: nestdb
          JWT_SECRET: 'secreto'
          PORT: 3001
        depends_on:
          - postgres
    volumes:
      postgres_data:
  

## Ejecución de la Aplicacion
1. **Inicia los contenedores del backend y la base de datos:**
   
   Desde la raíz del proyecto, ejecuta el siguiente comando para construir y levantar los contenedores de NestJS y PostgreSQL:
   
   ``` bash
   docker-compose up --build
  

2. **Inicia el frontend (Next.js)**
   
   ```bash
    cd front-innova  # Asegúrate de estar en la carpeta de Next.js
    npm install  # Instala las dependencias
    npm run dev  # Inicia el servidor de desarrollo

   
3. **Accede a la aplicacion**
   
  - Frontend: El frontend esta disponible por la ruta http://localhost:3000, se accedera a este mediante el navegador.
  - Backend: El backend está disponible en http://localhost:3001.