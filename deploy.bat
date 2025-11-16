@echo off
chcp 65001 >nul
echo ========================================
echo   Marine AI Assistant 部署腳本
echo ========================================
echo.

echo [1/4] 檢查專案狀態...
if not exist package.json (
    echo 錯誤：找不到 package.json，請確認在專案根目錄執行此腳本
    pause
    exit /b 1
)

echo [2/4] 安裝依賴...
call npm install
if errorlevel 1 (
    echo 錯誤：依賴安裝失敗
    pause
    exit /b 1
)

echo [3/4] 建置專案...
call npm run build
if errorlevel 1 (
    echo 錯誤：建置失敗
    pause
    exit /b 1
)

echo [4/4] 建置完成！
echo.
echo 建置輸出位於 dist/ 資料夾
echo.
echo 下一步：
echo 1. 如果使用 Vercel：執行 vercel --prod
echo 2. 如果使用 Netlify：執行 netlify deploy --prod --dir=dist
echo 3. 或上傳 dist/ 資料夾到您的伺服器
echo.
pause


