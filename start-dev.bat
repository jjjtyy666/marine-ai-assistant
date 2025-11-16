@echo off
chcp 65001 >nul
echo 正在啟動開發伺服器...
cd /d "%~dp0"
if not exist node_modules (
    echo 正在安裝依賴...
    call npm install
)
echo 啟動 Vite 開發伺服器...
call npm run dev
pause

