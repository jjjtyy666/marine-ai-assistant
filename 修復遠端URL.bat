@echo off
chcp 65001 >nul
echo ========================================
echo 修復遠端 URL 並推送
echo ========================================
echo.

cd /d "%~dp0"
echo 專案目錄: %CD%
echo.

echo [1] 檢查當前遠端 URL...
git remote -v
echo.

echo [2] 更新遠端 URL...
git remote set-url origin https://github.com/jjjtyy666/marine-ai-assistant.git
echo ✅ 遠端 URL 已更新
echo.

echo [3] 確認遠端 URL...
git remote -v
echo.

echo [4] 準備推送到 GitHub...
echo.
echo ⚠️  需要輸入認證資訊：
echo    Username: jjjtyy666
echo    Password: [貼上 Personal Access Token]
echo.
echo 按任意鍵開始推送...
pause >nul
echo.

git push -u origin main

if errorlevel 1 (
    echo.
    echo ========================================
    echo ❌ 推送失敗
    echo ========================================
    echo.
    echo 請檢查：
    echo 1. Personal Access Token 是否正確
    echo 2. Token 是否有 repo 權限
    echo 3. 倉庫是否存在：https://github.com/jjjtyy666/marine-ai-assistant
    echo.
    pause
    exit /b 1
) else (
    echo.
    echo ========================================
    echo ✅ 推送成功！
    echo ========================================
    echo.
    echo 🌐 專案網址：
    echo    https://github.com/jjjtyy666/marine-ai-assistant
    echo.
    pause
)

