# 🔌 API 整合指南

本指南說明如何將專案從 Mock 資料切換到真實 API 和 AI 服務。

## 📋 目錄

1. [環境變數設定](#環境變數設定)
2. [API 端點配置](#api-端點配置)
3. [AI 服務配置](#ai-服務配置)
4. [測試與驗證](#測試與驗證)

## 🔧 環境變數設定

### 1. 複製環境變數範本

```bash
# 如果還沒有 .env 檔案，請複製 .env.example
cp .env.example .env
```

### 2. 編輯 .env 檔案

開啟 `.env` 檔案並填入您的配置：

```env
# API 配置
VITE_API_BASE_URL=http://localhost:3000/api

# AI 聊天服務配置
VITE_AI_PROVIDER=openai

# OpenAI 配置
VITE_OPENAI_API_KEY=sk-your-api-key-here
VITE_OPENAI_BASE_URL=https://api.openai.com/v1
VITE_OPENAI_MODEL=gpt-4o-mini

# 是否使用 Mock 資料（設為 false 使用真實 API）
VITE_USE_MOCK_DATA=false
```

## 🌐 API 端點配置

### 後端 API 端點格式

您的後端 API 應該提供以下端點：

#### 1. 取得地點
```
GET /api/spots
Response: Spot[]
```

#### 2. 取得天氣資料
```
GET /api/weather?spotId=xxx&date=2025-10-09
Response: WeatherData
```

#### 3. 取得海況資料
```
GET /api/sea-state?spotId=xxx&date=2025-10-09
Response: SeaStateData
```

#### 4. 取得潮汐資料
```
GET /api/tide?spotId=xxx&date=2025-10-09
Response: TideData
```

#### 5. 取得附近 POI
```
GET /api/nearby-pois?spotId=xxx&radiusKm=5&categories=food,cafe
Response: POI[]
```

#### 6. 規劃一日行程
```
POST /api/plan-day
Body: {
  spotId: string,
  date: string,
  startTime: string,
  endTime: string,
  mobility: Mobility,
  budget?: number,
  preferences?: any
}
Response: PlanDay
```

#### 7. 計算路線
```
POST /api/route
Body: {
  pois: POI[],
  mobility: Mobility,
  spotCoords: [number, number]
}
Response: RouteInfo
```

#### 8. 取得營業時間
```
GET /api/open-hours?poiIds=poi1,poi2,poi3
Response: OpenHoursData
```

### 資料格式

請參考 `src/types/index.ts` 中的 TypeScript 類型定義，確保您的 API 回應格式符合這些類型。

## 🤖 AI 服務配置

### 選項 1: OpenAI

1. 取得 OpenAI API Key：https://platform.openai.com/api-keys
2. 在 `.env` 中設定：
```env
VITE_AI_PROVIDER=openai
VITE_OPENAI_API_KEY=sk-your-api-key-here
VITE_OPENAI_MODEL=gpt-4o-mini  # 或 gpt-4, gpt-3.5-turbo
```

### 選項 2: DeepSeek (推薦) ⭐

1. 取得 DeepSeek API Key：https://platform.deepseek.com/api_keys
2. 在 `.env` 中設定：
```env
VITE_AI_PROVIDER=deepseek
VITE_DEEPSEEK_API_KEY=sk-your-api-key-here
VITE_DEEPSEEK_MODEL=deepseek-reasoner  # 或 deepseek-chat
VITE_DEEPSEEK_BASE_URL=https://api.deepseek.com/v1
```

**注意**：DeepSeek R1 (deepseek-reasoner) 是推理模型，適合需要邏輯思考的對話。

### 選項 3: Anthropic (Claude)

1. 取得 Anthropic API Key：https://console.anthropic.com/
2. 在 `.env` 中設定：
```env
VITE_AI_PROVIDER=anthropic
VITE_ANTHROPIC_API_KEY=sk-ant-your-api-key-here
VITE_ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

### 選項 4: 自訂 AI API

如果您有自己的 AI 服務：

1. 在 `.env` 中設定：
```env
VITE_AI_PROVIDER=custom
VITE_CUSTOM_AI_API_URL=http://localhost:8000/api/chat
VITE_CUSTOM_AI_API_KEY=your-api-key-here
```

2. 您的 API 應該接受以下格式的請求：
```json
{
  "messages": [
    { "role": "user", "content": "用戶訊息" },
    { "role": "assistant", "content": "AI 回應" }
  ]
}
```

3. 回應格式：
```json
{
  "content": "AI 回應內容",
  "toolCalls": []  // 可選
}
```

## 🧪 測試與驗證

### 1. 檢查配置

啟動開發伺服器後，開啟瀏覽器 Console，應該會看到配置資訊（如果配置錯誤會有警告）。

### 2. 測試 API 連線

在瀏覽器 Console 執行：

```javascript
// 測試取得地點
fetch('http://localhost:3000/api/spots')
  .then(r => r.json())
  .then(console.log)
```

### 3. 測試 AI 聊天

1. 進入 `/chat` 頁面
2. 發送測試訊息：「幫我查詢旗津的天氣」
3. 檢查是否成功調用 AI 和 API

### 4. 錯誤處理

如果 API 或 AI 服務失敗，系統會自動回退到 Mock 模式，並在 Console 顯示警告訊息。

## 🔄 切換模式

### 使用真實 API
```env
VITE_USE_MOCK_DATA=false
```

### 使用 Mock 資料（開發/測試）
```env
VITE_USE_MOCK_DATA=true
```

## 📝 注意事項

1. **API Key 安全**：`.env` 檔案不應該提交到 Git，已加入 `.gitignore`
2. **CORS**：確保您的後端 API 允許前端域名的跨域請求
3. **錯誤處理**：所有 API 調用都有錯誤處理，失敗時會自動回退到 Mock 資料
4. **超時設定**：預設 API 請求超時為 30 秒，可在 `src/config/api.ts` 中調整

## 🆘 常見問題

### Q: AI 服務沒有回應？
A: 檢查：
- API Key 是否正確設定
- 網路連線是否正常
- Console 是否有錯誤訊息
- 是否達到 API 使用限制

### Q: API 請求失敗？
A: 檢查：
- `VITE_API_BASE_URL` 是否正確
- 後端服務是否正在運行
- CORS 設定是否正確
- API 回應格式是否符合類型定義

### Q: 如何同時使用真實 API 和 Mock AI？
A: 目前不支援混合模式，但您可以：
1. 設定 `VITE_USE_MOCK_DATA=false` 使用真實 API
2. 在 `src/services/api.ts` 中修改 `sendChatMessage` 來強制使用 Mock

## 📚 相關檔案

- `src/config/api.ts` - API 配置
- `src/config/ai.ts` - AI 服務配置
- `src/services/api.ts` - API 服務層
- `src/services/aiService.ts` - AI 服務層
- `src/types/index.ts` - 類型定義

---

**需要幫助？** 請查看專案的 [README.md](./README.md) 或提交 Issue。

