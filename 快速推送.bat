@echo off
chcp 65001 >nul
echo ========================================
echo 快速推送到 GitHub
echo ========================================
echo.

REM 切換到專案目錄
cd /d "%~dp0"
echo 專案目錄: %CD%
echo.

REM 檢查是否已初始化 Git
if not exist .git (
    echo 正在初始化 Git...
    git init
    git branch -M main
    echo ✅ Git 初始化完成
    echo.
)

REM 檢查遠端倉庫
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo 正在添加遠端倉庫...
    git remote add origin https://github.com/jjjtyy666/marine-ai-assistant.git
    echo ✅ 遠端倉庫已添加
    echo.
)

REM 添加所有文件
echo 正在添加文件...
git add .
echo ✅ 文件已添加
echo.

REM 提交
echo 正在提交更改...
git diff --cached --quiet
if errorlevel 1 (
    git commit -m "更新：海洋 AI 助理前端專案"
    echo ✅ 提交成功
) else (
    echo ⚠️  沒有變更需要提交
    REM 檢查是否有任何提交
    git log --oneline -1 >nul 2>&1
    if errorlevel 1 (
        echo 尚未有任何提交，建立初始提交...
        git commit --allow-empty -m "初始提交：海洋 AI 助理前端專案"
        echo ✅ 初始提交已建立
    )
)
echo.

REM 推送
echo ========================================
echo 正在推送到 GitHub...
echo ========================================
echo.
echo 📌 如果是第一次推送，Git 會要求輸入認證資訊：
echo.
echo    Username: jjjtyy666
echo    Password: [貼上你的 Personal Access Token]
echo.
echo 💡 如何取得 Personal Access Token：
echo    1. 前往 https://github.com/settings/tokens
echo    2. 點擊 "Generate new token" → "Generate new token (classic)"
echo    3. 勾選 "repo" 權限
echo    4. 複製產生的 token（只會顯示一次！）
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
    echo 2. Token 是否有 "repo" 權限
    echo 3. 倉庫名稱是否正確：jjjtyy666/marine-ai-assistant
    echo.
    echo 詳細說明請參考：設定GitHub認證.md
    echo.
    pause
    exit /b 1
) else (
    echo.
    echo ========================================
    echo ✅ 推送成功！
    echo ========================================
    echo.
    echo 🌐 你的專案網址：
    echo    https://github.com/jjjtyy666/marine-ai-assistant
    echo.
    echo 📦 下一步：可以前往 Vercel 或 Netlify 部署
    echo    參考：DEPLOYMENT_GUIDE.md
    echo.
    pause
)

