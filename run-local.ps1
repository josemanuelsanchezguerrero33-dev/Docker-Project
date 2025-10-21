<#
run-local.ps1 - Ejecuta la aplicación en modo desarrollo (nodemon)

Uso:
  .\run-local.ps1

Requisitos:
  - Node.js instalado
  - Ejecutar `npm install` al menos una vez antes
#>

Write-Host "⚙️ Iniciando en modo desarrollo..." -ForegroundColor Cyan

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js no está instalado o no está en PATH. Instálalo desde https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host "Instalando dependencias (si es necesario)..." -NoNewline
npm install
if ($LASTEXITCODE -ne 0) { Write-Host " ✗" -ForegroundColor Red; exit 1 } else { Write-Host " ✓" -ForegroundColor Green }

Write-Host "Iniciando nodemon... (npm run dev)" -ForegroundColor Cyan
npm run dev
