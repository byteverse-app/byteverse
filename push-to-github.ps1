# Run this script to sync with GitHub and push your commit.
# Best: close Cursor/VS Code, open a plain PowerShell window, cd to repo, run:
#   .\push-to-github.ps1

Set-Location $PSScriptRoot

$lockPath = Join-Path $PSScriptRoot ".git\index.lock"
if (Test-Path $lockPath) {
    Write-Host "Removing stale .git/index.lock..." -ForegroundColor Yellow
    Remove-Item -Force $lockPath -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
    if (Test-Path $lockPath) {
        Write-Host "ERROR: index.lock still exists. Close Cursor, all terminals, and any Git GUI, then run this script again from a new PowerShell window." -ForegroundColor Red
        exit 1
    }
}

Write-Host "1. Restoring working tree (discards local node_modules changes)..." -ForegroundColor Cyan
git restore .
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "2. Fetching from origin..." -ForegroundColor Cyan
git fetch origin
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "3. Rebasing your commit on top of origin/main..." -ForegroundColor Cyan
git pull origin main --rebase
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "4. Pushing to GitHub..." -ForegroundColor Cyan
git push origin main
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Done. Your changes are on GitHub." -ForegroundColor Green
Write-Host "Run 'npm install' if you need to refresh node_modules." -ForegroundColor Yellow
