@echo off
chcp 65001 >nul
echo ========================================
echo 驗證 GitHub 推送狀態
echo ========================================
echo.

cd /d "%~dp0"
echo 專案目錄: %CD%
echo.

echo [1] 檢查本地提交...
git log --oneline -5
echo.

echo [2] 檢查遠端 URL...
git remote -v
echo.

echo [3] 檢查分支狀態...
git branch -vv
echo.

echo [4] 檢查遠端狀態...
git fetch origin
git status
echo.

echo [5] 測試遠端連線...
git ls-remote origin
if errorlevel 1 (
    echo.
    echo ⚠️  無法連接到遠端倉庫
) else (
    echo.
    echo ✅ 遠端倉庫連線正常
)
echo.

echo ========================================
echo 驗證完成
echo ========================================
echo.
echo 如果看到 "Everything up-to-date"，表示推送成功！
echo.
echo 請訪問以下網址確認：
echo https://github.com/jjjtyy666/marine-ai-assistant
echo.
pause

