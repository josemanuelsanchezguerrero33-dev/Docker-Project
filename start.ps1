<#
Start.ps1 - Levanta la aplicación usando Docker Compose (PowerShell)

Uso:
  .\start.ps1       # Levanta los servicios en segundo plano
  .\start.ps1 -Rebuild  # Fuerza rebuild de las imágenes
#>

param(
    [switch]$Rebuild
)

Write-Host "📦 Levantando la aplicación con Docker Compose..." -ForegroundColor Cyan

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker no está instalado o no está en PATH. Abre Docker Desktop antes de continuar." -ForegroundColor Red
    exit 1
}

if ($Rebuild) {
    docker-compose down -v
    docker-compose up -d --build
} else {
    docker-compose up -d
}

Write-Host "Esperando 5 segundos para que la base de datos inicialice..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "Comprobando /health..." -NoNewline
try {
    $health = Invoke-RestMethod -Uri http://localhost:3000/health -UseBasicParsing -TimeoutSec 5
    Write-Host " ✓ " -ForegroundColor Green
    Write-Host "Aplicación lista en http://localhost:3000"
} catch {
    Write-Host " ✗ (aún no lista). Revisa los logs con: docker-compose logs -f" -ForegroundColor Yellow
}
