# Script para crear un repo en GitHub y pushear el proyecto
# Requisitos: Git y GitHub CLI (gh) instalados y autenticados (gh auth login)

param(
  [string]$repoName = "docker-crud-mysql",
  [string]$private = "false"
)

Write-Host "== Crear repo $repoName en GitHub y subir código =="

# Comprueba si gh está instalado
if (!(Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Host "gh (GitHub CLI) no encontrado. Por favor instala gh y autentícate: https://cli.github.com/" -ForegroundColor Yellow
  Write-Host "Instrucciones alternativas (manual):"
  Write-Host "  1) Crea un repositorio en https://github.com/new con el nombre: $repoName"
  Write-Host "  2) Ejecuta en tu proyecto:" 
  Write-Host "     git init"
  Write-Host "     git add ."
  Write-Host "     git commit -m 'Initial commit'"
  Write-Host "     git remote add origin https://github.com/<tu-usuario>/$repoName.git"
  Write-Host "     git push -u origin main"
  exit 1
}

# Crear repo con gh
$visibility = if ($private -eq "true") { "private" } else { "public" }
$createCmd = "gh repo create $repoName --$visibility --source=. --remote=origin --push"
Write-Host "Ejecutando: $createCmd"
Invoke-Expression $createCmd

Write-Host "Repo creado y push inicial realizado. Abre tu repositorio en GitHub (desde tu cuenta) o usa 'gh repo view --web' para abrir en el navegador."