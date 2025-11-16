# 部署指南

本指南說明如何將 Marine AI Assistant 部署到各種平台。

## 🌐 部署選項

### 選項 1: Vercel（推薦）

Vercel 是最簡單的部署方式，完全免費且自動化。

#### 步驟：

1. **安裝 Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **登入 Vercel**
   ```bash
   vercel login
   ```

3. **部署**
   ```bash
   vercel
   ```

4. **生產部署**
   ```bash
   vercel --prod
   ```

#### 或使用 Git 整合：

1. 將專案推送到 GitHub
2. 訪問 [vercel.com](https://vercel.com)
3. 點擊 "New Project"
4. 導入您的 GitHub 專案
5. Vercel 會自動偵測 Vite 並配置
6. 點擊 "Deploy"

### 選項 2: Netlify

#### 使用 Netlify CLI：

1. **安裝 CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **建置專案**
   ```bash
   npm run build
   ```

3. **部署**
   ```bash
   netlify deploy --prod --dir=dist
   ```

#### 或使用 Git 整合：

1. 推送到 GitHub
2. 訪問 [netlify.com](https://netlify.com)
3. 點擊 "New site from Git"
4. 選擇您的倉庫
5. 設定：
   - Build command: `npm run build`
   - Publish directory: `dist`
6. 點擊 "Deploy site"

### 選項 3: GitHub Pages

1. **安裝 gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **修改 package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/sea-help-front"
   }
   ```

3. **修改 vite.config.ts**
   ```typescript
   export default defineConfig({
     base: '/sea-help-front/', // 替換為您的倉庫名稱
     // ...
   })
   ```

4. **部署**
   ```bash
   npm run deploy
   ```

### 選項 4: 傳統主機（Apache/Nginx）

#### 建置專案

```bash
npm run build
```

這會在 `dist/` 資料夾生成靜態檔案。

#### Apache 配置

在 `dist/` 目錄創建 `.htaccess`：

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

#### Nginx 配置

```nginx
server {
  listen 80;
  server_name yourdomain.com;
  root /path/to/dist;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  # 開啟 Gzip 壓縮
  gzip on;
  gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### 選項 5: Docker

#### 創建 Dockerfile

```dockerfile
# 建置階段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生產階段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 創建 nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### 建置與執行

```bash
# 建置映像檔
docker build -t marine-ai-assistant .

# 執行容器
docker run -d -p 80:80 marine-ai-assistant
```

#### 使用 Docker Compose

創建 `docker-compose.yml`：

```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
```

執行：
```bash
docker-compose up -d
```

## 🔧 環境變數

如果需要設定環境變數，創建 `.env` 文件：

```env
VITE_API_BASE_URL=https://api.example.com
VITE_MAP_API_KEY=your-api-key
```

在程式碼中使用：
```typescript
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

**注意**：Vite 的環境變數必須以 `VITE_` 開頭。

## 📊 建置最佳化

### 1. 分析 Bundle 大小

安裝 rollup-plugin-visualizer：

```bash
npm install --save-dev rollup-plugin-visualizer
```

修改 `vite.config.ts`：

```typescript
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ]
})
```

### 2. 啟用壓縮

```typescript
import viteCompression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    })
  ]
})
```

### 3. 程式碼分割

使用 React.lazy：

```typescript
const HomePage = lazy(() => import('@/pages/HomePage'))
const ChatPage = lazy(() => import('@/pages/ChatPage'))

// 在 routes 中
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/chat" element={<ChatPage />} />
  </Routes>
</Suspense>
```

## 🔒 安全性

### 1. 設定 CSP Headers

在 Nginx 配置中：

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;";
```

### 2. HTTPS

使用 Let's Encrypt 免費 SSL：

```bash
# 安裝 certbot
sudo apt-get install certbot python3-certbot-nginx

# 獲取憑證
sudo certbot --nginx -d yourdomain.com
```

### 3. 設定 CORS

如果需要連接後端 API，在後端設定 CORS：

```javascript
// Express.js 範例
app.use(cors({
  origin: 'https://yourdomain.com',
  credentials: true
}))
```

## 📈 效能監控

### 使用 Google Analytics

在 `index.html` 中加入：

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 使用 Sentry 錯誤追蹤

```bash
npm install @sentry/react
```

在 `main.tsx` 中：

```typescript
import * as Sentry from "@sentry/react"

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
})
```

## ✅ 部署檢查清單

部署前確認：

- [ ] 已執行 `npm run build` 成功
- [ ] 已測試建置輸出 (`npm run preview`)
- [ ] 已設定正確的 `base` 路徑
- [ ] 已配置環境變數
- [ ] 已設定 404 重導向到 index.html
- [ ] 已啟用 Gzip 壓縮
- [ ] 已設定快取標頭
- [ ] 已配置 HTTPS
- [ ] 已測試所有頁面路由
- [ ] 已測試手機版本
- [ ] 已檢查 Console 無錯誤

## 🚀 CI/CD 自動化

### GitHub Actions 範例

創建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 📞 支援

如有部署問題，請檢查：
1. [Vite 部署文檔](https://vitejs.dev/guide/static-deploy.html)
2. [React Router 文檔](https://reactrouter.com/en/main/start/tutorial#deploying)
3. 專案的 GitHub Issues

---

**Happy Deploying!** 🚀

