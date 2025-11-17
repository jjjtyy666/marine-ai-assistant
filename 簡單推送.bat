@echo off
chcp 65001 >nul
echo ========================================
echo 簡單推送到 GitHub
echo ========================================
echo.

cd /d "%~dp0"
echo 專案目錄: %CD%
echo.

REM 初始化（如果需要）
if not exist .git (
    echo 初始化 Git...
    git init
    git branch -M main
)

REM 設定遠端（如果需要）
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo 設定遠端倉庫...
    git remote add origin https://github.com/jjjtyy666/marine-ai-assistant.git
)

REM 添加文件
echo 添加文件...
git add .

REM 提交
echo 提交更改...
git commit -m "初始提交" 2>nul
if errorlevel 1 (
    git log --oneline -1 >nul 2>&1
    if errorlevel 1 (
        git commit --allow-empty -m "初始提交"
    )
)

REM 推送
echo.
echo ========================================
echo 推送到 GitHub
echo ========================================
echo.
echo 需要輸入認證資訊：
echo Username: jjjtyy666
echo Password: [貼上 Personal Access Token]
echo.
echo 按任意鍵開始推送...
pause >nul
echo.

git push -u origin main

if errorlevel 1 (
    echo.
    echo ========================================
    echo 推送失敗
    echo ========================================
    echo.
    echo 請檢查：
    echo 1. Personal Access Token 是否正確
    echo 2. Token 是否有 repo 權限
    echo 3. 倉庫是否存在
    echo.
    echo 執行「診斷推送問題.bat」可以查看詳細資訊
    echo.
    pause
    exit /b 1
) else (
    echo.
    echo ========================================
    echo 推送成功
    echo ========================================
    echo.
    echo 專案網址：
    echo https://github.com/jjjtyy666/marine-ai-assistant
    echo.
    pause
)

