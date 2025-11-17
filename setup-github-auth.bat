@echo off
chcp 65001 >nul
echo ========================================
echo GitHub 認證設定助手
echo ========================================
echo.

REM 檢查 Git 配置
echo [1/4] 檢查 Git 配置...
git config --global user.name >nul 2>&1
if errorlevel 1 (
    echo ⚠️  未設定 Git 用戶名
    set /p GIT_NAME="請輸入你的 GitHub 用戶名: "
    git config --global user.name "%GIT_NAME%"
) else (
    echo ✅ Git 用戶名: 
    git config --global user.name
)

git config --global user.email >nul 2>&1
if errorlevel 1 (
    echo ⚠️  未設定 Git 電子郵件
    set /p GIT_EMAIL="請輸入你的電子郵件: "
    git config --global user.email "%GIT_EMAIL%"
) else (
    echo ✅ Git 電子郵件: 
    git config --global user.email
)
echo.

REM 設定認證助手
echo [2/4] 設定認證助手...
git config --global credential.helper manager-core
echo ✅ 已設定 Windows Credential Manager
echo.

REM 檢查 SSH 金鑰
echo [3/4] 檢查 SSH 金鑰...
if exist "%USERPROFILE%\.ssh\id_ed25519.pub" (
    echo ✅ 找到 SSH 公鑰
    echo.
    echo 你的 SSH 公鑰內容：
    type "%USERPROFILE%\.ssh\id_ed25519.pub"
    echo.
    echo 如果尚未添加到 GitHub，請：
    echo 1. 複製上面的公鑰內容
    echo 2. 前往 https://github.com/settings/keys
    echo 3. 點擊 "New SSH key" 並貼上
    echo.
) else if exist "%USERPROFILE%\.ssh\id_rsa.pub" (
    echo ✅ 找到 SSH 公鑰 (RSA)
    echo.
    echo 你的 SSH 公鑰內容：
    type "%USERPROFILE%\.ssh\id_rsa.pub"
    echo.
    echo 如果尚未添加到 GitHub，請：
    echo 1. 複製上面的公鑰內容
    echo 2. 前往 https://github.com/settings/keys
    echo 3. 點擊 "New SSH key" 並貼上
    echo.
) else (
    echo ⚠️  未找到 SSH 金鑰
    echo.
    set /p CREATE_SSH="是否要建立新的 SSH 金鑰？(Y/N): "
    if /i "%CREATE_SSH%"=="Y" (
        set /p SSH_EMAIL="請輸入你的電子郵件: "
        ssh-keygen -t ed25519 -C "%SSH_EMAIL%"
        echo.
        echo ✅ SSH 金鑰已建立
        echo.
        echo 請複製以下公鑰並添加到 GitHub：
        type "%USERPROFILE%\.ssh\id_ed25519.pub"
        echo.
        echo 前往：https://github.com/settings/keys
        pause
    )
)
echo.

REM 顯示認證選項
echo [4/4] 認證方式選擇
echo.
echo 請選擇認證方式：
echo.
echo [1] HTTPS + Personal Access Token（推薦新手）
echo [2] SSH（推薦長期使用）
echo [3] 使用 GitHub CLI（如果已安裝）
echo.
set /p AUTH_METHOD="請選擇 (1/2/3): "

if "%AUTH_METHOD%"=="1" (
    echo.
    echo ========================================
    echo HTTPS + Personal Access Token 設定
    echo ========================================
    echo.
    echo 請按照以下步驟操作：
    echo.
    echo 1. 前往：https://github.com/settings/tokens
    echo 2. 點擊 "Generate new token" → "Generate new token (classic)"
    echo 3. 設定：
    echo    - Note: marine-ai-assistant
    echo    - Expiration: 90 days 或 No expiration
    echo    - Select scopes: 勾選 "repo"
    echo 4. 點擊 "Generate token"
    echo 5. 複製產生的 token（只會顯示一次！）
    echo.
    echo 當推送時，Git 會要求輸入：
    echo - Username: 你的 GitHub 用戶名
    echo - Password: 貼上剛才的 token（不是密碼！）
    echo.
    echo 設定完成後，按任意鍵繼續推送...
    pause >nul
    goto :push
)

if "%AUTH_METHOD%"=="2" (
    echo.
    echo ========================================
    echo SSH 設定
    echo ========================================
    echo.
    REM 更改遠端 URL
    git remote set-url origin git@github.com:jjjtyy666/marine-ai-assistant.git 2>nul
    echo ✅ 已更改遠端 URL 為 SSH
    echo.
    echo 測試 SSH 連線...
    ssh -T git@github.com
    echo.
    goto :push
)

if "%AUTH_METHOD%"=="3" (
    echo.
    echo ========================================
    echo GitHub CLI 設定
    echo ========================================
    echo.
    gh auth login
    echo.
    goto :push
)

:push
echo.
echo ========================================
echo 準備推送
echo ========================================
echo.
echo 當前目錄: %CD%
echo.
set /p CONFIRM="是否現在推送到 GitHub？(Y/N): "
if /i not "%CONFIRM%"=="Y" (
    echo 已取消
    pause
    exit /b 0
)

REM 切換到專案目錄
cd /d "%~dp0"

REM 初始化 Git（如果尚未初始化）
if not exist .git (
    echo 正在初始化 Git...
    git init
    git branch -M main
)

REM 添加文件
echo 正在添加文件...
git add .

REM 提交
echo 正在提交...
git commit -m "初始提交：海洋 AI 助理前端專案" 2>nul
if errorlevel 1 (
    echo ⚠️  沒有變更需要提交，或提交失敗
)

REM 設定遠端（如果尚未設定）
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    git remote add origin https://github.com/jjjtyy666/marine-ai-assistant.git
)

REM 推送
echo.
echo 正在推送到 GitHub...
echo 注意：如果是第一次推送，可能需要輸入認證資訊
git push -u origin main

if errorlevel 1 (
    echo.
    echo ========================================
    echo ❌ 推送失敗
    echo ========================================
    echo.
    echo 可能的原因：
    echo 1. 認證失敗 - 請確認已正確設定 Personal Access Token 或 SSH
    echo 2. 遠端倉庫不存在 - 請確認倉庫名稱正確
    echo 3. 沒有權限 - 請確認你有該倉庫的寫入權限
    echo.
    echo 詳細說明請參考：設定GitHub認證.md
    echo.
) else (
    echo.
    echo ========================================
    echo ✅ 推送成功！
    echo ========================================
    echo.
    echo 你的專案已上傳到：
    echo https://github.com/jjjtyy666/marine-ai-assistant
    echo.
)

pause

