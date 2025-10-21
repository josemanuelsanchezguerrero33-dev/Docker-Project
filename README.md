# Inventory Manager 🏢

Sistema profesional de gestión de inventario con Node.js, Express y MySQL usando Docker.

## 📋 Características

- ✨ Interfaz moderna y profesional con tema oscuro
- 📊 Dashboard con estadísticas en tiempo real
- 🔍 Sistema de búsqueda y filtrado avanzado
- 🏷️ Badges inteligentes para niveles de stock
- 💡 Tooltips informativos y feedback visual
- 🎨 Animaciones y transiciones suaves
- � Diseño completamente responsive
- 🐳 Completamente dockerizado
- � Hot-reload para desarrollo

## 🚀 Inicio Rápido

### Windows (PowerShell) - Scripts incluidos

Este repositorio incluye dos scripts para PowerShell:

- `start.ps1` — Levanta la aplicación con Docker Compose. Ejemplos:
  - `.\start.ps1`  (levanta en background)
  - `.\start.ps1 -Rebuild`  (fuerza reconstrucción)
- `run-local.ps1` — Ejecuta la aplicación en modo desarrollo con `nodemon`:
  - `.\run-local.ps1`

Ejecuta PowerShell como administrador si necesitas permisos adicionales para Docker.


### Opción 1: Usar Docker Compose (Recomendado)

```bash
# Clonar o navegar al directorio
cd C:\Users\pinnc\docker-crud-app

# Levantar la aplicación
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener la aplicación
docker-compose down
```

### Opción 2: Construir y ejecutar manualmente

```bash
# Construir la imagen
docker build -t crud-app .

  # Ejecutar MySQL
  docker run -d \
    --name crud_mysql \
    -e MYSQL_ROOT_PASSWORD=rootpassword \
    -e MYSQL_DATABASE=cruddb \
    -e MYSQL_USER=appuser \
    -e MYSQL_PASSWORD=apppass123 \
    -p 3307:3306 \
    mysql:8.0

# Ejecutar la aplicación
docker run -d \
  --name crud_app \
  -p 3000:3000 \
  -e DB_HOST=host.docker.internal \
  crud-app
```

## 🌐 Acceso

Una vez levantada la aplicación, accede a:

**http://localhost:3000**

## � Usar la Imagen desde Docker Hub

La aplicación está disponible en Docker Hub y puede ser ejecutada directamente:

```bash
# Descargar y ejecutar la aplicación
docker compose pull
docker compose up -d
```

O si prefieres ejecutar los contenedores manualmente:

```bash
# Pull de la imagen
docker pull josemanuel343/inventory-manager:latest

# Crear red para los contenedores
docker network create inventory-network

# Ejecutar MySQL
docker run -d \
  --name inventory_db \
  --network inventory-network \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=cruddb \
  -e MYSQL_USER=appuser \
  -e MYSQL_PASSWORD=apppass123 \
  -p 3307:3306 \
  mysql:8.0

# Ejecutar la aplicación
docker run -d \
  --name inventory_manager \
  --network inventory-network \
  -e DB_HOST=inventory_db \
  -p 3000:3000 \
  josemanuel343/inventory-manager:latest
```

La aplicación estará disponible en http://localhost:3000

## 🛠️ Tecnologías Utilizadas

- **Backend**: Node.js + Express
-- **Base de datos**: MySQL
- **Frontend**: HTML5 + CSS3 + JavaScript vanilla
- **Containerización**: Docker + Docker Compose

## 📊 Estructura del Proyecto

```
docker-crud-app/
├── public/
│   └── index.html          # Interfaz web
├── server.js               # Servidor Express
├── package.json            # Dependencias
├── Dockerfile              # Construcción de la imagen
├── docker-compose.yml      # Orquestación de contenedores
├── .dockerignore          # Archivos a ignorar
└── README.md              # Este archivo
```

## 🔧 Variables de Entorno

| Variable | Valor por defecto | Descripción |
|----------|-------------------|-------------|
| `PORT` | `3000` | Puerto del servidor |
| `DB_HOST` | `db` | Host de MySQL |
| `DB_PORT` | `3306` | Puerto de MySQL |
| `DB_USER` | `appuser` | Usuario de BD |
| `DB_PASSWORD` | `apppass123` | Contraseña de BD |
| `DB_NAME` | `cruddb` | Nombre de la BD |

## 📝 API Endpoints

- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos/:id` - Obtener un producto por ID
- `POST /api/productos` - Crear un nuevo producto
- `PUT /api/productos/:id` - Actualizar un producto
- `DELETE /api/productos/:id` - Eliminar un producto
- `GET /health` - Health check del servidor

## 🎯 Comandos Útiles

```bash
# Ver contenedores en ejecución
docker ps

# Ver logs de la aplicación
docker logs crud_app -f


# Ver logs de la base de datos
docker logs crud_mysql -f

# Entrar al contenedor de la app
docker exec -it crud_app sh

# Entrar a MySQL (cliente)
docker exec -it crud_mysql mysql -u appuser -papppass123 cruddb

# Limpiar todo (contenedores, imágenes, volúmenes)
docker-compose down -v
docker system prune -a
```

## 🐛 Troubleshooting

### La aplicación no se conecta a la BD

1. Verificar que el contenedor de MySQL esté corriendo:
  ```bash
  docker ps | grep crud_mysql
  ```

2. Ver logs de la BD:
  ```bash
  docker logs crud_mysql -f
  ```

### Puerto 3000 ya está en uso

Cambiar el puerto en `docker-compose.yml`:
```yaml
ports:
  - "8080:3000"  # Usar puerto 8080 en lugar de 3000
```

## 📄 Licencia

MIT

## 👨‍💻 Autor

Taller Docker - CRUD Application
