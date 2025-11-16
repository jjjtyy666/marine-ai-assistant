# 🌤️ 天氣與海況真實資料配置指南

本指南說明如何將天氣和海況資料從 Mock 改為使用真實 API。

## 📋 支援的資料來源

### 天氣資料來源

1. **OpenWeatherMap** ⭐ 推薦（免費額度充足）
2. **中央氣象署 (CWB)** - 台灣地區專用
3. **Stormglass** - 海洋天氣專用

### 海況資料來源

1. **Stormglass** ⭐ 推薦（專業海洋資料）
2. **NOAA** - 美國國家海洋和大氣管理局
3. **中央氣象署 (CWB)** - 台灣地區

## ⚙️ 快速配置

在 `.env` 檔案中添加以下配置：

```env
# ============================================
# 天氣與海況真實資料配置
# ============================================

# 啟用真實天氣資料
VITE_USE_REAL_WEATHER=true

# 啟用真實海況資料
VITE_USE_REAL_SEA_STATE=true

# 天氣資料來源 (openweather, cwb, stormglass)
VITE_WEATHER_PROVIDER=openweather

# 海況資料來源 (stormglass, noaa, cwb)
VITE_SEA_STATE_PROVIDER=stormglass

# ============================================
# OpenWeatherMap 配置
# ============================================
# 取得 API Key: https://openweathermap.org/api
VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here

# ============================================
# Stormglass 配置（海況和海洋天氣）
# ============================================
# 取得 API Key: https://stormglass.io/
VITE_STORMGLASS_API_KEY=your_stormglass_api_key_here

# ============================================
# 中央氣象署 (CWB) 配置
# ============================================
# 取得 API Key: https://opendata.cwb.gov.tw/
VITE_CWB_API_KEY=your_cwb_api_key_here
```

## 🔑 取得 API Key

### 1. OpenWeatherMap（天氣）

1. 前往：https://openweathermap.org/api
2. 註冊帳號（免費）
3. 進入 API Keys 頁面
4. 建立新的 API Key
5. 免費方案：每分鐘 60 次請求，每天 1,000,000 次

**優點**：
- 免費額度充足
- 全球覆蓋
- 資料準確
- 支援中文

### 2. Stormglass（海況）⭐ 推薦

1. 前往：https://stormglass.io/
2. 註冊帳號
3. 進入 Dashboard 取得 API Key
4. 免費方案：每天 50 次請求

**優點**：
- 專業海洋資料
- 包含浪高、週期、流向等詳細資訊
- 全球覆蓋

### 3. 中央氣象署 (CWB)（台灣地區）⭐ 推薦

1. 前往：https://opendata.cwb.gov.tw/
2. 註冊帳號
3. 申請 API Key
4. 免費使用

**API 資訊**：
- 天氣預報：`F-C0032-001` - 一般天氣預報-今明36小時天氣預報
- 波浪預報：`F-A0021-001` - 臺灣海域波浪預報逐三小時數值模式資料

**優點**：
- 台灣地區資料最準確
- 完全免費
- 官方資料來源
- 支援天氣和海況資料

## 📝 配置範例

### 範例 1: OpenWeatherMap + Stormglass（推薦）

```env
VITE_USE_REAL_WEATHER=true
VITE_USE_REAL_SEA_STATE=true
VITE_WEATHER_PROVIDER=openweather
VITE_SEA_STATE_PROVIDER=stormglass
VITE_OPENWEATHER_API_KEY=your_key_here
VITE_STORMGLASS_API_KEY=your_key_here
```

### 範例 2: 全部使用 Stormglass

```env
VITE_USE_REAL_WEATHER=true
VITE_USE_REAL_SEA_STATE=true
VITE_WEATHER_PROVIDER=stormglass
VITE_SEA_STATE_PROVIDER=stormglass
VITE_STORMGLASS_API_KEY=your_key_here
```

### 範例 3: 台灣地區使用 CWB

```env
VITE_USE_REAL_WEATHER=true
VITE_USE_REAL_SEA_STATE=true
VITE_WEATHER_PROVIDER=cwb
VITE_SEA_STATE_PROVIDER=cwb
VITE_CWB_API_KEY=your_key_here
```

## 🧪 測試配置

### 1. 檢查環境變數

確認 `.env` 檔案中的配置正確。

### 2. 重新啟動開發伺服器

```bash
npm run dev
```

### 3. 測試天氣資料

1. 進入 `/dashboard` 頁面
2. 選擇一個地點（如：旗津）
3. 查看天氣資料是否為真實資料

### 4. 測試海況資料

1. 進入 `/dashboard` 頁面
2. 查看海況資料（浪高、週期等）
3. 確認資料為真實資料

### 5. 測試聊天功能

1. 進入 `/chat` 頁面
2. 輸入：「幫我查詢旗津的天氣和海況」
3. 確認顯示真實資料

## 🔍 故障排除

### 問題：API Key 錯誤

**解決方案**：
- 確認 API Key 是否正確複製
- 確認 API Key 是否有效（未過期）
- 檢查 `.env` 檔案中的變數名稱是否正確

### 問題：請求失敗

**解決方案**：
- 檢查網路連線
- 確認 API Key 是否達到使用限制
- 查看瀏覽器 Console 的錯誤訊息
- 確認 API 服務是否正常運行

### 問題：資料格式錯誤

**解決方案**：
- 確認 API 回應格式是否符合預期
- 檢查 `src/services/weatherService.ts` 和 `src/services/seaStateService.ts`
- 查看 Console 的錯誤訊息

### 問題：仍然使用 Mock 資料

**解決方案**：
- 確認 `VITE_USE_REAL_WEATHER=true`
- 確認 `VITE_USE_REAL_SEA_STATE=true`
- 確認 `VITE_USE_MOCK_DATA=false`
- 重新啟動開發伺服器

## 💡 使用建議

### 開發環境

- 可以使用 Mock 資料進行開發
- 設定 `VITE_USE_MOCK_DATA=true`

### 生產環境

- 使用真實 API 資料
- 設定 `VITE_USE_REAL_WEATHER=true`
- 設定 `VITE_USE_REAL_SEA_STATE=true`
- 注意 API 使用限制

### 成本考量

- **OpenWeatherMap**：免費額度充足，適合大多數應用
- **Stormglass**：免費方案每天 50 次，適合小規模應用
- **CWB**：完全免費，但僅限台灣地區

## 📊 API 使用限制

### OpenWeatherMap
- 免費方案：每分鐘 60 次，每天 1,000,000 次
- 付費方案：更高額度

### Stormglass
- 免費方案：每天 50 次請求
- 付費方案：更高額度

### CWB
- 免費使用，無明確限制

## 🔄 回退機制

系統內建自動回退機制：
- 如果真實 API 失敗，會自動使用 Mock 資料
- 確保應用程式不會因為 API 問題而無法使用

## 📚 相關檔案

- `src/services/weatherService.ts` - 天氣服務
- `src/services/seaStateService.ts` - 海況服務
- `src/services/api.ts` - API 整合層
- `src/types/index.ts` - 資料類型定義

---

**需要更多幫助？** 請查看 [API_INTEGRATION.md](./API_INTEGRATION.md) 或提交 Issue。

