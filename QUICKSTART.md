# 快速啟動指南

本指南將協助您在 5 分鐘內啟動 Marine AI Assistant。

## 步驟 1：確認環境

確保您已安裝：
- Node.js 18 或更高版本
- npm 或 yarn

檢查版本：
```bash
node --version  # 應該 >= 18.0.0
npm --version   # 應該 >= 9.0.0
```

## 步驟 2：安裝依賴

```bash
npm install
```

這將安裝所有必要的套件，包括：
- React 18
- TypeScript
- Tailwind CSS
- Recharts
- Leaflet
- 等等...

安裝時間約 1-2 分鐘。

## 步驟 3：啟動開發伺服器

```bash
npm run dev
```

您將看到類似這樣的輸出：

```
  VITE v5.2.8  ready in 543 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

## 步驟 4：開啟瀏覽器

在瀏覽器中打開 `http://localhost:5173`

您應該會看到 Marine AI Assistant 的首頁！

## 🎯 快速體驗功能

### 1. AI 對話
- 點擊首頁的「開始對話」按鈕
- 嘗試輸入：「幫我查詢旗津的海況」
- AI 會回覆並顯示天氣、海況、潮汐卡片

### 2. 儀表板
- 點擊導航欄的「儀表板」
- 查看即時 KPI 和圖表
- 切換不同地點

### 3. 地圖
- 點擊導航欄的「地圖瀏覽」
- 點擊地圖上的標記
- 收藏喜歡的地點

### 4. 主題切換
- 點擊右上角的月亮/太陽圖標
- 體驗深色/淺色主題

## 🛠️ 常見問題

### Q: Port 5173 已被占用？
修改 `vite.config.ts`：
```typescript
export default defineConfig({
  server: {
    port: 3000, // 改成其他 port
  },
})
```

### Q: 地圖無法顯示？
確保網路連線正常，地圖使用 OpenStreetMap 需要網路連線。

### Q: 套件安裝失敗？
嘗試清除快取：
```bash
rm -rf node_modules package-lock.json
npm install
```

### Q: TypeScript 錯誤？
確保使用的 Node.js 版本 >= 18

## 📱 手機測試

在相同網路下，使用手機瀏覽器訪問：

```bash
npm run dev -- --host
```

然後在手機瀏覽器輸入電腦的 IP 位址（終端會顯示）。

## 🚀 下一步

- 閱讀 [README.md](./README.md) 了解完整功能
- 查看 `src/pages/` 了解頁面實作
- 修改 `src/i18n/locales/zh-TW.json` 自訂文案
- 調整 `tailwind.config.js` 自訂主題顏色

## 💡 開發提示

### 熱重載
修改程式碼後會自動重載，無需手動刷新瀏覽器。

### Mock API
所有 API 都是模擬的，在 `src/mocks/` 和 `src/services/api.ts` 中。

### 建議的開發流程
1. 先理解 `src/types/index.ts` 的資料結構
2. 查看 `src/services/api.ts` 的 API 介面
3. 開始修改組件或新增功能

祝您開發愉快！🌊

