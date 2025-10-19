# Dockerfile + Docker Compose (CRUD + MySQL)

## Objetivo
Crear una app web CRUD  y levantarla junto con MySQL usando **Dockerfile** y **Docker Compose**.

## Estructura
```
docker-crud-mysql/
├─ Dockerfile
├─ docker-compose.yml
├─ .env
├─ package.json
├─ app.js
├─ public/
│  └─ index.html
└─ db/
   └─ schema.sql
```

## Paso a paso
1) Clona o descomprime este proyecto.
2) Abre una terminal en la carpeta `docker-crud-mysql`.
3) Levanta todo:
   ```bash
   docker compose up -d --build
   ```
4) Cuando `db` esté saludable, la API quedará en **http://localhost:3000** y Adminer en **http://localhost:8080**.

### Probar rápido
- Navegador: abre `http://localhost:3000` (frontend simple).
- API:
  ```bash
  curl http://localhost:3000/api/tasks
  curl -X POST http://localhost:3000/api/tasks -H "Content-Type: application/json" -d '{"title":"Nueva tarea"}'
  curl -X PUT  http://localhost:3000/api/tasks/1 -H "Content-Type: application/json" -d '{"done":true}'
  curl -X DELETE http://localhost:3000/api/tasks/1
  ```

### Adminer
- URL: http://localhost:8080
- Sistema: MySQL
- Servidor: `db`
- Usuario: `appuser`
- Contraseña: `apppass`
- Base de datos: `appdb`

## Notas
- La DB persiste en el volumen `db_data`.
- Variables en `.env`. Cambia contraseñas si lo deseas.
- El servicio `web` carga el código por volumen para desarrollo en caliente.

## Troubleshooting
- Puertos ocupados: cambia `PORT`, `3306`, `8080` en compose o libera puertos.
- Error de conexión a MySQL: espera a que el healthcheck marque `healthy` o revisa credenciales.
- Reiniciar limpio:
  ```bash
  docker compose down -v
  docker compose up -d --build
  ```

## Publicar en Docker Hub

1) Etiqueta y build local (ya está hecho si ejecutaste `docker build -t josemanuel343/docker-crud-mysql:latest .`):

```bash
docker build -t josemanuel343/docker-crud-mysql:latest .
```

2) Inicia sesión en Docker Hub desde tu máquina:

```bash
docker login
```

3) Empuja la imagen:

```bash
docker push josemanuel343/docker-crud-mysql:latest
```

4) Usar la imagen remota en `docker-compose.yml` (opcional): reemplaza `build: .` por `image: josemanuel343/docker-crud-mysql:latest` en el servicio `web`.

### Automatizar con GitHub Actions

He incluido un workflow en `.github/workflows/docker-publish.yml` que construye y publica la imagen cuando haces push a la rama `main`.

Para que funcione, añade estos secrets al repositorio en GitHub: `DOCKERHUB_USERNAME` y `DOCKERHUB_TOKEN` (token desde Docker Hub > Account Settings > Security > New Access Token).

El workflow construirá y publicará la imagen con las etiquetas `latest` y `${{ github.sha }}`.

