# 🗓️ 行程規劃功能說明

## 功能概述

Marine AI Assistant 新增了完整的「附近景點安排」功能，讓使用者能透過自然語言對話或視覺化介面，規劃海邊一日輕旅行。

## 🎯 核心功能

### 1. AI 智慧行程規劃

透過自然語言對話，AI 會自動：
- 偵測地點、日期、預算等需求
- 結合即時海況、天氣、潮汐資料
- 生成完整的一日行程時間軸
- 提供安全建議與備案

**使用範例：**
```
「明天想在旗津安排一日輕旅行，機車移動、預算1500、想吃海鮮、一定要看日落」
```

AI 會自動：
- ✅ 安排清晨衝浪時段（依海況）
- ✅ 推薦附近餐廳（符合預算與偏好）
- ✅ 規劃日落觀景點行程
- ✅ 計算移動時間與成本
- ✅ 檢查營業時間衝突

### 2. 附近 POI 查詢

系統內建 20+ 個景點與設施，包含：

| 類別 | 說明 | 範例 |
|------|------|------|
| 🍽️ 餐飲 | 海鮮餐廳、在地小吃 | 阿某海鮮、都蘭食堂 |
| ☕ 咖啡廳 | 適合休息、工作的咖啡館 | 海風咖啡、月光小棧 |
| 🏄 租借店 | 衝浪板、SUP 租借與教學 | 浪點租板店、北海衝浪店 |
| 🚿 淋浴間 | 公共淋浴設施 | 旗津淋浴間 |
| 🅿️ 停車場 | 機車/汽車停車 | 旗津停車場 |
| 🌅 景觀點 | 日落、拍照景點 | 旗津日落觀景點、燭台雙嶼 |
| 🏛️ 文化景點 | 廟宇、文創園區 | 旗津天后宮、都蘭糖廠 |

**查詢方式：**
```
「旗津附近有哪些餐廳和咖啡廳？」
「金山周邊有租板店嗎？順便推薦淋浴的地方」
```

### 3. 視覺化行程編輯

在 `/plan` 頁面可以：
- 📍 選擇衝浪點
- 📅 設定日期
- 💰 設定預算
- 👥 設定人數
- 🛵 選擇交通方式
- 🎯 一鍵生成行程

### 4. 智慧時間規劃

系統會自動：
- ⏰ 依據潮汐安排最佳衝浪時段
- 🍽️ 避開店家午休時間
- 🌅 計算日落時間並提前安排
- 🚗 計算移動時間（依交通方式）
- ⚠️ 提示可能的衝突與風險

## 📊 資料結構

### POI (Point of Interest)
```typescript
{
  id: 'poi_cijin_seafood',
  name: '阿某海鮮',
  cat: 'food',
  lat: 22.613,
  lng: 120.266,
  price: '$$',
  rating: 4.2,
  tags: ['海鮮', '在地'],
  description: '在地老字號海鮮餐廳',
  phone: '07-5712345',
  address: '高雄市旗津區...'
}
```

### 行程計畫
```typescript
{
  spotId: 'cijin',
  date: '2025-10-09',
  mobility: 'scooter',
  budget: 1500,
  timeline: [
    {
      type: 'surf',
      title: '清晨衝浪',
      start: '06:30',
      end: '08:30',
      notes: '浪高1.2m、週期10s，適合新手'
    },
    {
      type: 'food',
      poiId: 'poi_cijin_seafood',
      title: '阿某海鮮',
      start: '11:45',
      end: '12:45',
      budget: 350,
      move: { mode: 'scooter', mins: 15, km: 2.5 }
    },
    // ...
  ],
  estTotalCost: 1200,
  warnings: ['阿某海鮮午休 14:00-17:00，請留意時段']
}
```

## 🎨 UI 組件

### 1. POIGroupList
顯示分類的 POI 清單，支援：
- 依類別分組
- 評分與價格顯示
- 收藏功能
- 點擊查看詳情

### 2. ItineraryTimeline
視覺化時間軸，顯示：
- 活動時間與停留時長
- 移動方式與時間
- 預估花費
- 警示訊息
- 海況摘要

### 3. POICard
單一 POI 卡片，顯示：
- 名稱與類別
- 評分與標籤
- 地址與電話
- 收藏按鈕

## 🔧 技術實作

### Mock API 端點

```typescript
api.getNearbyPOIs(spotId, radiusKm, categories)
api.planDay(spotId, date, startTime, endTime, mobility, budget, preferences)
api.getRoute(pois, mobility, spotCoords)
api.getOpenHours(poiIds)
```

### 智慧規劃邏輯

1. **海況分析**
   - 浪高 0.5-1.5m → 適合新手
   - 浪高 1.5-2.5m → 適合進階
   - 浪高 > 2.5m → 專業玩家

2. **時段安排**
   - 清晨 06:30-08:30 → 衝浪
   - 上午 09:00-11:00 → 淋浴/咖啡
   - 中午 11:30-13:30 → 午餐
   - 下午 14:00-16:00 → 文化景點
   - 傍晚 17:00-18:30 → 日落觀景

3. **移動計算**
   - 步行：4 km/h
   - 自行車：15 km/h
   - 機車：28 km/h
   - 汽車：30 km/h（市區）

4. **預算控制**
   - $ = 100 元以下
   - $$ = 100-500 元
   - $$$ = 500 元以上

## 🚀 使用方式

### 方式 1：AI 對話（推薦）

1. 進入 `/chat` 頁面
2. 點擊快速提示或輸入需求
3. AI 會顯示行程卡片與附近 POI
4. 可繼續調整：「把午餐改成 300 元以內」

### 方式 2：視覺化介面

1. 進入 `/plan` 頁面
2. 選擇地點、日期、交通方式
3. 設定預算與人數
4. 點擊「生成行程」
5. 查看完整時間軸與景點清單

## 📱 快速提示範例

在 Chat 頁面，可點擊這些快速提示：

1. 「明天想在旗津安排一日輕旅行，機車移動、預算1500、想吃海鮮、一定要看日落」
2. 「幫我查詢金山附近有哪些餐廳和咖啡廳」
3. 「都歷周邊有租板店嗎？順便推薦淋浴的地方」

## ⚠️ 警示系統

系統會自動檢測並警示：

- ⚠️ 預算超支
- ⚠️ 營業時間衝突（午休、公休日）
- ⚠️ 天氣風險（強風、降雨）
- ⚠️ 海況風險（浪高、流速）
- ⚠️ 時間重疊

## 🎯 未來擴展

### 可加入的功能

1. **路線地圖視覺化**
   - 在 Leaflet 地圖上畫出完整路線
   - 顯示各點位標記
   - 計算總距離與時間

2. **行程匯出**
   - 匯出為 JSON
   - 產生分享連結
   - 下載 iCalendar (.ics)

3. **即時協作**
   - 多人共同編輯行程
   - 即時同步更新

4. **更多偏好選項**
   - 飲食限制（素食、過敏原）
   - 無障礙需求
   - 寵物友善
   - 親子適合

5. **歷史記錄**
   - 儲存過往行程
   - 收藏常去路線
   - 快速重用

## 🔌 替換真實 API

要串接真實後端，修改 `src/services/api.ts`：

```typescript
async getNearbyPOIs(spotId: string) {
  const response = await fetch(`/api/spots/${spotId}/nearby`)
  return response.json()
}

async planDay(spotId: string, date: string, ...) {
  const response = await fetch('/api/plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ spotId, date, ... })
  })
  return response.json()
}
```

## 📚 相關檔案

### 新增檔案
- `src/mocks/poi.ts` - POI Mock 資料
- `src/mocks/openHours.ts` - 營業時間資料
- `src/mocks/planningData.ts` - 行程生成邏輯
- `src/lib/planningUtils.ts` - 規劃工具函數
- `src/components/planning/POICard.tsx` - POI 卡片
- `src/components/planning/POIGroupList.tsx` - POI 列表
- `src/components/planning/ItineraryTimeline.tsx` - 時間軸
- `src/pages/PlanPage.tsx` - 規劃頁面

### 修改檔案
- `src/types/index.ts` - 新增類型定義
- `src/services/api.ts` - 新增 API 端點
- `src/components/chat/MessageBubble.tsx` - 支援新工具卡
- `src/components/chat/QuickPrompts.tsx` - 新增快速提示
- `src/App.tsx` - 新增路由
- `src/components/layout/Navbar.tsx` - 新增導航項目

---

**立即體驗：啟動專案後，在 Chat 頁面輸入「明天想在旗津安排一日行程」！** 🌊

