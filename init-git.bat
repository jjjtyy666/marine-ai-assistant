@echo off
chcp 65001 >nul
echo ========================================
echo 初始化 Git 倉庫並推送到 GitHub
echo ========================================
echo.

REM 切換到專案目錄
cd /d "%~dp0"
echo 當前目錄: %CD%
echo.

REM 檢查是否已經有 .git 目錄
if exist .git (
    echo 發現現有的 .git 目錄，正在清理...
    rd /s /q .git
    echo 清理完成
    echo.
)

REM 初始化 Git
echo 正在初始化 Git 倉庫...
git init
if errorlevel 1 (
    echo 錯誤: Git 初始化失敗
    pause
    exit /b 1
)
echo.

REM 添加所有文件
echo 正在添加文件到 Git...
git add .
if errorlevel 1 (
    echo 錯誤: 添加文件失敗
    pause
    exit /b 1
)
echo.

REM 提交
echo 正在提交更改...
git commit -m "初始提交：海洋 AI 助理前端專案"
if errorlevel 1 (
    echo 錯誤: 提交失敗
    pause
    exit /b 1
)
echo.

REM 重命名分支為 main
echo 正在重命名分支為 main...
git branch -M main
echo.

REM 添加遠端倉庫
echo 正在添加遠端倉庫...
git remote add origin https://github.com/jjjtyy666/marine-ai-assistant.git
if errorlevel 1 (
    echo 警告: 遠端倉庫可能已存在，嘗試更新...
    git remote set-url origin https://github.com/jjjtyy666/marine-ai-assistant.git
)
echo.

REM 推送到 GitHub
echo 正在推送到 GitHub...
echo 注意: 如果這是第一次推送，可能需要輸入 GitHub 憑證
git push -u origin main
if errorlevel 1 (
    echo.
    echo ========================================
    echo 推送失敗！可能的原因：
    echo 1. 需要 GitHub 認證（Personal Access Token）
    echo 2. 遠端倉庫不存在或沒有權限
    echo.
    echo 請檢查：
    echo - GitHub 倉庫是否存在
    echo - 是否已設置 GitHub Personal Access Token
    echo ========================================
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ 成功推送到 GitHub！
echo ========================================
echo.
pause

