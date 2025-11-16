# 🚀 上架部署完整指南

本指南提供詳細的步驟，幫助您將 Marine AI Assistant 部署上線。

## 📋 部署前準備

### 1. 確認專案狀態

```bash
# 測試建置
npm run build

# 預覽建置結果
npm run preview
```

### 2. 準備環境變數

確保您的 `.env` 檔案包含所有必要的配置：

```env
# AI 服務
VITE_AI_PROVIDER=deepseek
VITE_DEEPSEEK_IS_LOCAL=true
VITE_DEEPSEEK_BASE_URL=http://localhost:11434/v1
VITE_DEEPSEEK_MODEL=deepseek-r1:latest

# 天氣與海況
VITE_USE_REAL_WEATHER=true
VITE_USE_REAL_SEA_STATE=true
VITE_WEATHER_PROVIDER=cwb
VITE_SEA_STATE_PROVIDER=cwb
VITE_CWB_API_KEY=CWA-265A4DB1-FD45-4491-971F-D0D6B92DB008

# API 配置
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_USE_MOCK_DATA=false
```

**注意**：部署時需要在部署平台設定這些環境變數。

## 🌐 推薦部署方式

### 方式 1: Vercel（最簡單）⭐ 推薦

#### 步驟 1: 安裝 Vercel CLI

```bash
npm install -g vercel
```

#### 步驟 2: 登入 Vercel

```bash
vercel login
```

#### 步驟 3: 部署

```bash
# 在專案根目錄執行
vercel
```

#### 步驟 4: 設定環境變數

1. 前往 Vercel Dashboard：https://vercel.com/dashboard
2. 選擇您的專案
3. 進入 Settings → Environment Variables
4. 添加所有 `.env` 檔案中的變數

#### 步驟 5: 生產部署

```bash
vercel --prod
```

#### 或使用 Git 整合（推薦）

1. **將專案推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo.git
   git push -u origin main
   ```

2. **在 Vercel 連接 GitHub**
   - 訪問 https://vercel.com
   - 點擊 "New Project"
   - 選擇 "Import Git Repository"
   - 選擇您的 GitHub 倉庫
   - Vercel 會自動偵測 Vite 專案

3. **設定環境變數**
   - 在專案設定中添加所有環境變數
   - 確保所有 `VITE_` 開頭的變數都已設定

4. **部署**
   - 點擊 "Deploy"
   - 等待建置完成

### 方式 2: Netlify

#### 步驟 1: 安裝 Netlify CLI

```bash
npm install -g netlify-cli
```

#### 步驟 2: 登入 Netlify

```bash
netlify login
```

#### 步驟 3: 初始化專案

```bash
netlify init
```

#### 步驟 4: 設定環境變數

```bash
# 在 Netlify Dashboard 設定，或使用 CLI
netlify env:set VITE_AI_PROVIDER deepseek
netlify env:set VITE_DEEPSEEK_IS_LOCAL true
# ... 設定其他變數
```

#### 步驟 5: 部署

```bash
netlify deploy --prod
```

### 方式 3: GitHub Pages

#### 步驟 1: 安裝 gh-pages

```bash
npm install --save-dev gh-pages
```

#### 步驟 2: 更新 package.json

```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://yourusername.github.io/sea-help-front"
}
```

#### 步驟 3: 更新 vite.config.ts

```typescript
export default defineConfig({
  base: '/sea-help-front/', // 您的倉庫名稱
  // ...
})
```

#### 步驟 4: 部署

```bash
npm run deploy
```

## ⚙️ 環境變數設定（重要）

### 在 Vercel 設定環境變數

1. 進入專案設定
2. 點擊 "Environment Variables"
3. 添加以下變數：

```
VITE_AI_PROVIDER = deepseek
VITE_DEEPSEEK_IS_LOCAL = true
VITE_DEEPSEEK_BASE_URL = http://localhost:11434/v1
VITE_DEEPSEEK_MODEL = deepseek-r1:latest
VITE_USE_REAL_WEATHER = true
VITE_USE_REAL_SEA_STATE = true
VITE_WEATHER_PROVIDER = cwb
VITE_SEA_STATE_PROVIDER = cwb
VITE_CWB_API_KEY = CWA-265A4DB1-FD45-4491-971F-D0D6B92DB008
VITE_USE_MOCK_DATA = false
```

**注意**：如果使用本地 Ollama，`VITE_DEEPSEEK_BASE_URL` 需要改為可公開訪問的 URL，或使用遠端 AI 服務。

### 在 Netlify 設定環境變數

1. 進入 Site settings
2. 點擊 "Environment variables"
3. 添加所有變數

## 🔧 部署配置檔案

### Vercel 配置（可選）

創建 `vercel.json`：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Netlify 配置

創建 `netlify.toml`：

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## ⚠️ 重要注意事項

### 1. 本地 AI 服務（Ollama）

如果使用本地 Ollama，部署後無法訪問 `localhost:11434`。您需要：

**選項 A**: 使用遠端 AI 服務
- 設定 `VITE_DEEPSEEK_IS_LOCAL=false`
- 使用 DeepSeek 官方 API 或自訂遠端 API

**選項 B**: 部署 Ollama 到伺服器
- 在伺服器上運行 Ollama
- 設定 `VITE_DEEPSEEK_BASE_URL` 為伺服器 URL

### 2. API 端點

確保後端 API 支援 CORS，允許前端域名訪問。

### 3. 環境變數安全

- 不要將 `.env` 檔案提交到 Git
- 在部署平台設定環境變數
- API Key 不要寫在程式碼中

## 📝 部署檢查清單

部署前確認：

- [ ] 已執行 `npm run build` 成功
- [ ] 已測試 `npm run preview` 正常運作
- [ ] 已設定所有環境變數
- [ ] 已確認 API 端點可訪問
- [ ] 已確認 AI 服務可訪問（如果使用遠端）
- [ ] 已測試所有頁面路由
- [ ] 已測試手機版本
- [ ] 已檢查 Console 無錯誤

## 🧪 部署後測試

1. **測試基本功能**
   - 訪問首頁
   - 測試路由切換
   - 測試主題切換

2. **測試 AI 聊天**
   - 進入 `/chat` 頁面
   - 發送測試訊息
   - 確認 AI 回應正常

3. **測試資料 API**
   - 進入 `/dashboard` 頁面
   - 確認天氣和海況資料正常顯示
   - 切換不同地點測試

4. **測試響應式**
   - 使用手機瀏覽器測試
   - 測試不同螢幕尺寸

## 🔍 故障排除

### 問題：建置失敗

**解決方案**：
- 檢查 Node.js 版本（需要 >= 18）
- 清除 `node_modules` 和 `package-lock.json`，重新安裝
- 檢查 TypeScript 錯誤

### 問題：路由 404

**解決方案**：
- 確認已設定 rewrite 規則（Vercel/Netlify）
- 確認 `base` 路徑設定正確

### 問題：環境變數未生效

**解決方案**：
- 確認變數名稱以 `VITE_` 開頭
- 重新部署專案
- 檢查部署平台的環境變數設定

### 問題：AI 服務無法連接

**解決方案**：
- 確認 AI 服務 URL 正確
- 確認服務支援 CORS
- 檢查 API Key 是否正確

## 📚 相關文件

- [DEPLOY.md](./DEPLOY.md) - 詳細部署選項
- [API_INTEGRATION.md](./API_INTEGRATION.md) - API 整合說明
- [OLLAMA_DEEPSEEK_SETUP.md](./OLLAMA_DEEPSEEK_SETUP.md) - Ollama 配置

---

**準備好上架了嗎？** 選擇一個部署方式開始吧！🚀


