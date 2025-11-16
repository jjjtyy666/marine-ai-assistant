# 啟動開發伺服器腳本
$ErrorActionPreference = "Stop"

# 設定專案路徑
$projectPath = $PSScriptRoot

Write-Host "正在切換到專案目錄: $projectPath" -ForegroundColor Cyan
Set-Location $projectPath

Write-Host "檢查依賴..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "正在安裝依賴..." -ForegroundColor Yellow
    npm install
}

Write-Host "正在啟動開發伺服器..." -ForegroundColor Green
npm run dev

