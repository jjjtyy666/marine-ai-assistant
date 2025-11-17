# 首次推送到 GitHub（PowerShell 版本）
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "首次推送到 GitHub（解決空倉庫問題）" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 切換到腳本所在目錄
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath
Write-Host "專案目錄: $(Get-Location)" -ForegroundColor Green
Write-Host ""

# 1. 檢查並初始化 Git
if (-not (Test-Path .git)) {
    Write-Host "[1/5] 正在初始化 Git..." -ForegroundColor Yellow
    git init
    git branch -M main
    Write-Host "✅ Git 初始化完成" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "✅ Git 已初始化" -ForegroundColor Green
    Write-Host ""
}

# 2. 檢查遠端倉庫
$remoteUrl = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "[2/5] 正在添加遠端倉庫..." -ForegroundColor Yellow
    git remote add origin https://github.com/jjjtyy666/marine-ai-assistant.git
    Write-Host "✅ 遠端倉庫已添加" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "✅ 遠端倉庫已設定" -ForegroundColor Green
    git remote -v
    Write-Host ""
}

# 3. 添加所有文件
Write-Host "[3/5] 正在添加文件到 Git..." -ForegroundColor Yellow
git add .
Write-Host "✅ 文件已添加" -ForegroundColor Green
Write-Host ""

# 4. 檢查並提交
Write-Host "[4/5] 正在提交更改..." -ForegroundColor Yellow
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
    git commit -m "初始提交：海洋 AI 助理前端專案"
    Write-Host "✅ 提交成功" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "⚠️  沒有變更需要提交" -ForegroundColor Yellow
    Write-Host "檢查現有提交..." -ForegroundColor Yellow
    $hasCommit = git log --oneline -1 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "尚未有任何提交，強制建立初始提交..." -ForegroundColor Yellow
        git commit --allow-empty -m "初始提交：海洋 AI 助理前端專案"
        Write-Host "✅ 空提交已建立" -ForegroundColor Green
    }
    Write-Host ""
}

# 5. 推送
Write-Host "[5/5] 正在推送到 GitHub..." -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  重要：如果是第一次推送，需要輸入認證資訊" -ForegroundColor Red
Write-Host ""
Write-Host "   Username: jjjtyy666" -ForegroundColor Cyan
Write-Host "   Password: [貼上 Personal Access Token]" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 如何取得 Personal Access Token：" -ForegroundColor Yellow
Write-Host "   1. 前往 https://github.com/settings/tokens" -ForegroundColor White
Write-Host "   2. 點擊 'Generate new token' → 'Generate new token (classic)'" -ForegroundColor White
Write-Host "   3. 勾選 'repo' 權限" -ForegroundColor White
Write-Host "   4. 複製產生的 token（格式：ghp_xxxxxxxxxxxxx）" -ForegroundColor White
Write-Host ""
Write-Host "按任意鍵開始推送..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Write-Host ""

# 嘗試推送
git push -u origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "❌ 推送失敗" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "可能的原因：" -ForegroundColor Yellow
    Write-Host "1. 認證失敗 - 請確認 Personal Access Token 正確" -ForegroundColor White
    Write-Host "2. 遠端倉庫不存在 - 請確認倉庫已建立" -ForegroundColor White
    Write-Host "3. 沒有權限 - 請確認 token 有 'repo' 權限" -ForegroundColor White
    Write-Host ""
    Write-Host "嘗試強制推送（如果遠端是空的）..." -ForegroundColor Yellow
    Write-Host ""
    $forcePush = Read-Host "是否要強制推送？(Y/N)"
    if ($forcePush -eq "Y" -or $forcePush -eq "y") {
        git push -u origin main --force
        if ($LASTEXITCODE -ne 0) {
            Write-Host ""
            Write-Host "強制推送也失敗，請檢查：" -ForegroundColor Red
            Write-Host "1. GitHub 倉庫是否存在：https://github.com/jjjtyy666/marine-ai-assistant" -ForegroundColor White
            Write-Host "2. Personal Access Token 是否正確" -ForegroundColor White
            Write-Host "3. 詳細說明請參考：設定GitHub認證.md" -ForegroundColor White
        } else {
            Write-Host ""
            Write-Host "✅ 強制推送成功！" -ForegroundColor Green
        }
    }
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✅ 推送成功！" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 你的專案網址：" -ForegroundColor Cyan
    Write-Host "   https://github.com/jjjtyy666/marine-ai-assistant" -ForegroundColor White
    Write-Host ""
    Write-Host "📦 下一步：可以前往 Vercel 部署" -ForegroundColor Cyan
    Write-Host "   參考：上架步驟.md" -ForegroundColor White
    Write-Host ""
}

Write-Host "按任意鍵結束..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

