@echo off
REM ====================================
REM SCRIPT PARA CONSTRUIR Y SUBIR A DOCKERHUB
REM ====================================

echo.
echo ========================================
echo   DOCKER CRUD APP - BUILD Y PUSH
echo ========================================
echo.

REM Solicitar usuario de DockerHub
set /p DOCKER_USER="Ingresa tu usuario de DockerHub: "

if "%DOCKER_USER%"=="" (
    echo Error: Debes ingresar un usuario de DockerHub
    pause
    exit /b 1
)

echo.
echo Usuario de DockerHub: %DOCKER_USER%
echo.

REM Login en DockerHub
echo.
echo [PASO 1] Haciendo login en DockerHub...
echo.
docker login
if %errorlevel% neq 0 (
    echo Error: No se pudo hacer login en DockerHub
    pause
    exit /b 1
)

REM Construir la imagen
echo.
echo [PASO 2] Construyendo la imagen Docker...
echo.
docker build -t %DOCKER_USER%/crud-app:latest .
if %errorlevel% neq 0 (
    echo Error: No se pudo construir la imagen
    pause
    exit /b 1
)

docker build -t %DOCKER_USER%/crud-app:1.0.0 .
if %errorlevel% neq 0 (
    echo Error: No se pudo etiquetar la imagen con version 1.0.0
    pause
    exit /b 1
)

REM Verificar que la imagen se creó
echo.
echo [PASO 3] Verificando que la imagen se creó correctamente...
echo.
docker images | findstr crud-app

REM Subir la imagen a DockerHub
echo.
echo [PASO 4] Subiendo la imagen a DockerHub...
echo.
echo Subiendo version latest...
docker push %DOCKER_USER%/crud-app:latest
if %errorlevel% neq 0 (
    echo Error: No se pudo subir la imagen latest
    pause
    exit /b 1
)

echo.
echo Subiendo version 1.0.0...
docker push %DOCKER_USER%/crud-app:1.0.0
if %errorlevel% neq 0 (
    echo Error: No se pudo subir la imagen 1.0.0
    pause
    exit /b 1
)

REM Éxito
echo.
echo ========================================
echo   IMAGEN SUBIDA EXITOSAMENTE!
echo ========================================
echo.
echo Tu imagen esta disponible en:
echo https://hub.docker.com/r/%DOCKER_USER%/crud-app
echo.
echo Para usar tu imagen:
echo docker pull %DOCKER_USER%/crud-app:latest
echo.

pause
