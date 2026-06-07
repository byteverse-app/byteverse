# Start FreeLLMAPI locally (Option A for ByteVerse)
# Requires: Node.js 20+, repo cloned to ../freellmapi (or set FREELLMAPI_DIR)

$ErrorActionPreference = "Stop"
$FreellmDir = if ($env:FREELLMAPI_DIR) { $env:FREELLMAPI_DIR } else { Join-Path (Split-Path $PSScriptRoot -Parent) "..\freellmapi" }
$FreellmDir = (Resolve-Path $FreellmDir -ErrorAction SilentlyContinue)
if (-not $FreellmDir) {
  Write-Host "Cloning FreeLLMAPI..."
  $parent = Split-Path (Split-Path $PSScriptRoot -Parent) -Parent
  git clone --depth 1 https://github.com/tashfeenahmed/freellmapi.git (Join-Path $parent "freellmapi")
  $FreellmDir = Join-Path $parent "freellmapi"
}

if (-not (Test-Path (Join-Path $FreellmDir ".env"))) {
  $key = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  @"
ENCRYPTION_KEY=$key
PORT=3001
"@ | Set-Content (Join-Path $FreellmDir ".env") -Encoding utf8
  Write-Host "Created .env in $FreellmDir"
}

Push-Location $FreellmDir
if (-not (Test-Path "node_modules")) { npm install }
Write-Host "Starting FreeLLMAPI on http://localhost:3001 (dashboard: http://localhost:5173)"
Write-Host "Copy the unified API key from the server log into apps/web/.env.local"
npm run dev
