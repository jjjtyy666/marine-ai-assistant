@echo off
chcp 65001 >nul
echo ========================================
echo 診斷推送問題
echo ========================================
echo.

cd /d "%~dp0"
echo 專案目錄: %CD%
echo.

echo [1] 檢查 Git 狀態...
git status --short
echo.

echo [2] 檢查遠端倉庫...
git remote -v
echo.

echo [3] 檢查本地提交...
git log --oneline -3
if errorlevel 1 (
    echo 警告: 沒有本地提交
)
echo.

echo [4] 檢查分支...
git branch
echo.

echo [5] 測試遠端連線...
git ls-remote origin
if errorlevel 1 (
    echo.
    echo ========================================
    echo 遠端連線失敗
    echo ========================================
    echo.
    echo 可能的原因：
    echo 1. 倉庫不存在或沒有權限
    echo 2. 認證失敗
    echo 3. 網路問題
    echo.
) else (
    echo.
    echo ========================================
    echo 遠端連線成功
    echo ========================================
    echo.
    echo 可以嘗試推送：
    echo git push -u origin main
    echo.
)

echo.
pause

