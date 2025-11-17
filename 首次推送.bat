@echo off
chcp 65001 >nul
echo ========================================
echo 首次推送到 GitHub（解決空倉庫問題）
echo ========================================
echo.

REM 切換到專案目錄
cd /d "%~dp0"
echo 專案目錄: %CD%
echo.

REM 檢查並初始化 Git
if not exist .git (
    echo [1/5] 正在初始化 Git...
    git init
    git branch -M main
    echo ✅ Git 初始化完成
    echo.
) else (
    echo ✅ Git 已初始化
    echo.
)

REM 檢查遠端倉庫
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo [2/5] 正在添加遠端倉庫...
    git remote add origin https://github.com/jjjtyy666/marine-ai-assistant.git
    echo ✅ 遠端倉庫已添加
    echo.
) else (
    echo ✅ 遠端倉庫已設定
    git remote -v
    echo.
)

REM 添加所有文件
echo [3/5] 正在添加文件到 Git...
git add .
echo ✅ 文件已添加
echo.

REM 檢查是否有變更需要提交
git diff --cached --quiet
if errorlevel 1 (
    echo [4/5] 正在提交更改...
    git commit -m "初始提交：海洋 AI 助理前端專案"
    echo ✅ 提交成功
    echo.
) else (
    echo ⚠️  沒有變更需要提交
    echo 檢查現有提交...
    git log --oneline -1 2>nul
    if errorlevel 1 (
        echo 尚未有任何提交，強制建立初始提交...
        git commit --allow-empty -m "初始提交：海洋 AI 助理前端專案"
        echo ✅ 空提交已建立
    )
    echo.
)

REM 推送
echo [5/5] 正在推送到 GitHub...
echo.
echo ⚠️  重要：如果是第一次推送，需要輸入認證資訊
echo.
echo    Username: jjjtyy666
echo    Password: [貼上 Personal Access Token]
echo.
echo 💡 如何取得 Personal Access Token：
echo    1. 前往 https://github.com/settings/tokens
echo    2. 點擊 "Generate new token" → "Generate new token (classic)"
echo    3. 勾選 "repo" 權限
echo    4. 複製產生的 token（格式：ghp_xxxxxxxxxxxxx）
echo.
echo 按任意鍵開始推送...
pause >nul
echo.

REM 嘗試推送
git push -u origin main

if errorlevel 1 (
    echo.
    echo ========================================
    echo ❌ 推送失敗
    echo ========================================
    echo.
    echo 可能的原因：
    echo 1. 認證失敗 - 請確認 Personal Access Token 正確
    echo 2. 遠端倉庫不存在 - 請確認倉庫已建立
    echo 3. 沒有權限 - 請確認 token 有 "repo" 權限
    echo.
    echo 嘗試強制推送（如果遠端是空的）...
    echo.
    set /p FORCE_PUSH="是否要強制推送？(Y/N): "
    if /i "%FORCE_PUSH%"=="Y" (
        git push -u origin main --force
        if errorlevel 1 (
            echo.
            echo 強制推送也失敗，請檢查：
            echo 1. GitHub 倉庫是否存在：https://github.com/jjjtyy666/marine-ai-assistant
            echo 2. Personal Access Token 是否正確
            echo 3. 詳細說明請參考：設定GitHub認證.md
        ) else (
            echo.
            echo ✅ 強制推送成功！
        )
    )
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
    echo 📦 下一步：可以前往 Vercel 部署
    echo    參考：上架步驟.md
    echo.
)

pause

