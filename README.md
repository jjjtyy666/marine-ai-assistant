# Marine AI Assistant - 海洋智慧助理

![Marine AI Assistant](https://img.shields.io/badge/React-18.3-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue) ![Vite](https://img.shields.io/badge/Vite-5.2-purple) ![License](https://img.shields.io/badge/license-MIT-green)

面向海洋遊憩/衝浪/旅遊使用情境的智慧助理 Demo 前端。結合 AI 對話、即時海況監測、地圖瀏覽與**智慧行程規劃**功能。

## ✨ 功能特色

### 🤖 AI 智慧對話
- 高質感對話介面，支援 Markdown 渲染
- 工具回調視覺化（天氣、海況、潮汐、**行程規劃**卡片）
- 快速提示詞與自動建議
- 支援上傳功能（UI 已完成）
- **新增：自然語言行程規劃**

### 🗓️ 智慧行程規劃 ⭐ NEW
- 自然語言對話規劃一日/半日行程
- 附近 POI 查詢（餐飲、咖啡、租借、淋浴等）
- 依海況/天氣/潮汐自動調整時段
- 視覺化時間軸與預算控制
- 移動時間與路線計算
- 營業時間衝突檢測

### 📊 海況儀表板
- 即時 KPI 監控（風速、風向、浪高、週期、潮位等）
- 24 小時趨勢圖表（Recharts）
- 警示提醒系統
- 多地點切換

### 🗺️ 地圖與點位瀏覽
- Leaflet 地圖整合（OpenStreetMap 底圖）
- 衝浪點與觀測站標記
- 收藏功能
- 點擊查看詳細資訊
- 一鍵開啟 AI 對話查詢

### 🎨 UI/UX 設計
- 海洋科技感視覺風格
- 深色/淺色主題切換
- 響應式設計（手機/平板/桌面）
- Framer Motion 動畫效果
- 玻璃擬態與柔和陰影

## 🛠️ 技術棧

- **框架**: React 18 + Vite 5
- **語言**: TypeScript 5
- **UI 組件**: 自建 shadcn/ui 風格組件
- **樣式**: Tailwind CSS 3
- **圖標**: Lucide React
- **圖表**: Recharts 2
- **地圖**: Leaflet + React-Leaflet
- **動畫**: Framer Motion 11
- **狀態管理**: Zustand 4
- **路由**: React Router 6
- **國際化**: i18next + react-i18next

## 📦 安裝與啟動

### 前置需求

- Node.js >= 18.0.0
- npm >= 9.0.0 或 yarn >= 1.22.0

### 安裝步驟

```bash
# 1. 進入專案目錄
cd "sea help front"

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器
npm run dev
```

開發伺服器會在 `http://localhost:5173` 啟動。

### 建置生產版本

```bash
# 建置
npm run build

# 預覽建置結果
npm run preview
```

## 📂 專案結構

```
sea-help-front/
├── public/                    # 靜態資源
├── src/
│   ├── components/           # 組件
│   │   ├── ui/              # 基礎 UI 組件
│   │   ├── chat/            # 聊天相關組件
│   │   ├── map/             # 地圖相關組件
│   │   └── layout/          # 布局組件
│   ├── pages/               # 頁面組件
│   │   ├── HomePage.tsx     # 首頁
│   │   ├── ChatPage.tsx     # AI 對話頁
│   │   ├── DashboardPage.tsx # 儀表板頁
│   │   └── SpotsPage.tsx    # 地圖頁
│   ├── stores/              # Zustand 狀態管理
│   ├── services/            # API 服務層
│   ├── mocks/               # Mock 資料
│   ├── i18n/                # 國際化設定
│   ├── lib/                 # 工具函數
│   ├── types/               # TypeScript 類型定義
│   ├── providers/           # Context Providers
│   ├── App.tsx              # 主應用組件
│   ├── main.tsx             # 入口文件
│   └── index.css            # 全域樣式
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## 🎯 核心頁面

### 1. 首頁 (`/`)
- 英雄區塊展示品牌
- 四大功能卡片入口
- 熱門衝浪點快速連結
- 數據統計展示

### 2. AI 對話 (`/chat`) ⭐ 主要功能
- 雙欄式對話介面
- 訊息泡泡（用戶/AI）
- 工具卡片（天氣、海況、潮汐、**行程、POI**）
- 快速提示詞（含行程規劃範例）
- 自動捲動到最新訊息
- **支援自然語言行程規劃**

### 3. 行程規劃 (`/plan`) ⭐ NEW
- 視覺化規劃介面
- 地點/日期/交通方式選擇
- 預算與人數設定
- 一鍵生成完整行程
- 時間軸視覺化
- 附近 POI 瀏覽

### 4. 儀表板 (`/dashboard`)
- 8 個 KPI 指標卡
- 4 組互動式圖表
- 地點選擇器
- 警示訊息

### 5. 地圖瀏覽 (`/spots`)
- 互動式地圖
- 點位列表與搜尋
- 收藏功能
- 點位詳細資訊

## 🔌 Mock API

本專案使用 Mock API 模擬後端服務，所有資料皆為模擬產生。

### API 端點

- `GET /api/spots` - 取得所有地點
- `GET /api/weather?spotId=xxx&date=xxx` - 取得天氣資料
- `GET /api/sea-state?spotId=xxx&date=xxx` - 取得海況資料
- `GET /api/tide?spotId=xxx&date=xxx` - 取得潮汐資料
- `POST /api/chat` - 發送聊天訊息
- **`GET /api/nearby-pois?spotId=xxx` - 取得附近 POI** ⭐ NEW
- **`POST /api/plan-day` - 生成一日行程** ⭐ NEW
- **`POST /api/get-route` - 計算路線** ⭐ NEW
- **`GET /api/open-hours?poiIds=xxx` - 取得營業時間** ⭐ NEW

### 替換真實 API

修改 `src/services/api.ts` 檔案，將 Mock 函數替換為真實的 API 請求：

```typescript
export const api = {
  async getSpots(): Promise<Spot[]> {
    const response = await fetch('/api/spots')
    return response.json()
  },
  // ... 其他 API 方法
}
```

## 🎨 主題系統

專案支援深色/淺色主題切換：

- 點擊導覽列右上角的月亮/太陽圖標切換主題
- 主題偏好會自動儲存至 localStorage
- 所有組件支援主題適配

### 自訂主題顏色

編輯 `src/index.css` 中的 CSS 變數：

```css
:root {
  --primary: 210 100% 50%;
  --background: 0 0% 100%;
  /* ... 更多顏色變數 */
}

.dark {
  --background: 222.2 84% 4.9%;
  /* ... 深色主題顏色 */
}
```

## 🌍 國際化

目前支援：
- 繁體中文（zh-TW）- 主要語言
- English（en）- 備用語言

### 新增語言

1. 在 `src/i18n/locales/` 新增語言檔案（如 `ja.json`）
2. 在 `src/i18n/index.ts` 註冊語言
3. 使用 `useTranslation` hook 取得翻譯函數

## 🗓️ 行程規劃功能詳解

### 使用方式 1：AI 對話（推薦）
在 `/chat` 頁面輸入自然語言需求：
```
「明天想在旗津安排一日輕旅行，機車移動、預算1500、想吃海鮮、一定要看日落」
```

AI 會自動：
- ✅ 分析海況安排衝浪時段
- ✅ 推薦符合預算的餐廳
- ✅ 計算日落時間安排觀景
- ✅ 規劃移動路線與時間
- ✅ 檢查營業時間避免撲空

### 使用方式 2：視覺化介面
1. 進入 `/plan` 頁面
2. 選擇地點、日期、交通方式
3. 設定預算與人數
4. 點擊「生成行程」
5. 查看完整時間軸

### 內建 POI 類別
- 🍽️ 餐飲（海鮮、在地小吃）
- ☕ 咖啡廳（適合休息、工作）
- 🏄 租借店（衝浪板、SUP）
- 🚿 淋浴間（公共設施）
- 🅿️ 停車場
- 🌅 景觀點（日落、拍照）
- 🏛️ 文化景點（廟宇、文創園區）

詳細說明請見 **[PLANNING_FEATURE.md](./PLANNING_FEATURE.md)**

## 📱 響應式設計

專案採用 Mobile-First 設計：

- **手機** (< 768px): 單欄布局、底部導航（含行程規劃入口）
- **平板** (768px - 1024px): 雙欄布局
- **桌面** (> 1024px): 多欄布局、側邊導航

## 🚀 效能優化建議

- 使用 React.lazy 和 Suspense 進行程式碼分割
- 圖片使用 WebP 格式並加入 lazy loading
- 使用 useMemo 和 useCallback 優化重複渲染
- 地圖組件按需載入

## 🧪 開發建議

### 推薦 VS Code 擴充功能

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

### 程式碼風格

專案遵循：
- ESLint 規則
- Prettier 格式化
- TypeScript 嚴格模式

## 📄 授權

MIT License

## 👥 貢獻

歡迎提交 Issue 和 Pull Request！

## 🙏 致謝

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Leaflet](https://leafletjs.com/)
- [Lucide](https://lucide.dev/)
- [Framer Motion](https://www.framer.com/motion/)

---

**Marine AI Assistant** - 讓海洋活動更安全、更智慧 🌊

