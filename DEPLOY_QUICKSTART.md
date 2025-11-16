# ⚡ 快速上架指南（5 分鐘）

最簡單的上架方式，跟著步驟做即可！

## 🚀 方式 1: Vercel（最簡單）

### 步驟 1: 準備 GitHub 倉庫

```bash
# 初始化 Git（如果還沒有）
git init

# 添加所有檔案
git add .

# 提交
git commit -m "準備部署"

# 推送到 GitHub（需要先在 GitHub 建立倉庫）
git remote add origin https://github.com/yourusername/your-repo.git
git branch -M main
git push -u origin main
```

### 步驟 2: 在 Vercel 部署

1. **訪問 Vercel**
   - 前往：https://vercel.com
   - 使用 GitHub 帳號登入

2. **導入專案**
   - 點擊 "Add New..." → "Project"
   - 選擇您的 GitHub 倉庫
   - 點擊 "Import"

3. **設定專案**
   - Framework Preset: Vite（自動偵測）
   - Root Directory: `./`
   - Build Command: `npm run build`（自動）
   - Output Directory: `dist`（自動）

4. **設定環境變數**
   - 點擊 "Environment Variables"
   - 添加以下變數：

```
VITE_AI_PROVIDER = deepseek
VITE_DEEPSEEK_IS_LOCAL = false
VITE_DEEPSEEK_API_KEY = your-api-key
VITE_USE_REAL_WEATHER = true
VITE_USE_REAL_SEA_STATE = true
VITE_WEATHER_PROVIDER = cwb
VITE_SEA_STATE_PROVIDER = cwb
VITE_CWB_API_KEY = CWA-265A4DB1-FD45-4491-971F-D0D6B92DB008
VITE_USE_MOCK_DATA = false
```

5. **部署**
   - 點擊 "Deploy"
   - 等待建置完成（約 1-2 分鐘）

6. **完成！**
   - 部署完成後會獲得一個 URL
   - 例如：`https://your-project.vercel.app`

## 🚀 方式 2: Netlify

### 步驟 1: 準備 GitHub 倉庫

（同 Vercel 步驟 1）

### 步驟 2: 在 Netlify 部署

1. **訪問 Netlify**
   - 前往：https://netlify.com
   - 使用 GitHub 帳號登入

2. **導入專案**
   - 點擊 "Add new site" → "Import an existing project"
   - 選擇 "Deploy with GitHub"
   - 選擇您的倉庫

3. **設定建置**
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **設定環境變數**
   - 點擊 "Site settings" → "Environment variables"
   - 添加所有環境變數（同 Vercel）

5. **部署**
   - 點擊 "Deploy site"
   - 等待建置完成

## ⚠️ 重要提醒

### 本地 AI 服務問題

如果使用本地 Ollama (`VITE_DEEPSEEK_IS_LOCAL=true`)，部署後無法訪問。

**解決方案**：
1. 使用遠端 AI 服務（DeepSeek 官方 API）
2. 或將 Ollama 部署到伺服器

### 環境變數設定

**必須**在部署平台設定環境變數，`.env` 檔案不會自動上傳。

## ✅ 部署後檢查

1. 訪問部署的 URL
2. 測試所有頁面
3. 測試 AI 聊天功能
4. 檢查 Console 是否有錯誤

## 🆘 遇到問題？

查看 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) 獲取詳細說明。

---

**開始部署吧！** 🚀


