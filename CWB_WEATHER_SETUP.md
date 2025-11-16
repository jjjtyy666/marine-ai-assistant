# 🌤️ 中央氣象署天氣預報 API 配置指南

本指南說明如何配置中央氣象署 (CWB) 的天氣預報 API 來取得真實天氣資料。

## 📋 API 資訊

- **資料集名稱**: 一般天氣預報-今明36小時天氣預報
- **資料集 ID**: F-C0032-001
- **資料內容**: 
  - 天氣現象 (Wx)
  - 降雨機率 (PoP)
  - 最低溫 (MinT)
  - 最高溫 (MaxT)
  - 風速 (WS)
  - 風向 (WD)
- **更新頻率**: 每 12 小時
- **預報時效**: 36 小時

## ⚙️ 配置步驟

### 1. 取得 API Key

您已經有 API Key：
```
CWA-265A4DB1-FD45-4491-971F-D0D6B92DB008
```

### 2. 在 .env 檔案中設定

```env
# 啟用真實天氣資料
VITE_USE_REAL_WEATHER=true

# 使用中央氣象署作為天氣資料來源
VITE_WEATHER_PROVIDER=cwb

# 中央氣象署 API Key
VITE_CWB_API_KEY=CWA-265A4DB1-FD45-4491-971F-D0D6B92DB008

# 使用真實 API（設為 false）
VITE_USE_MOCK_DATA=false
```

### 3. 完整配置範例（天氣 + 海況）

```env
# ============================================
# 天氣與海況資料配置 - 使用中央氣象署
# ============================================

# 天氣資料
VITE_USE_REAL_WEATHER=true
VITE_WEATHER_PROVIDER=cwb

# 海況資料
VITE_USE_REAL_SEA_STATE=true
VITE_SEA_STATE_PROVIDER=cwb

# 中央氣象署 API Key
VITE_CWB_API_KEY=CWA-265A4DB1-FD45-4491-971F-D0D6B92DB008

# 使用真實 API
VITE_USE_MOCK_DATA=false
```

## 🗺️ 支援的縣市

系統會根據地點座標自動選擇對應的縣市：

- **基隆市** - 外木山
- **新北市** - 金山、福隆
- **臺北市** - 市區
- **桃園市** - 桃園地區
- **新竹縣/市** - 新竹地區
- **苗栗縣** - 苗栗地區
- **臺中市** - 台中地區
- **彰化縣** - 彰化地區
- **南投縣** - 南投地區
- **雲林縣** - 雲林地區
- **嘉義縣/市** - 嘉義地區
- **臺南市** - 台南地區
- **高雄市** - 旗津 ⭐
- **屏東縣** - 屏東地區
- **宜蘭縣** - 宜蘭地區
- **花蓮縣** - 花蓮地區
- **臺東縣** - 都歷 ⭐
- **澎湖縣** - 澎湖地區

## 📊 資料格式說明

### CWB API 回應格式

```json
{
  "records": {
    "location": [{
      "locationName": "高雄市",
      "weatherElement": [
        {
          "elementName": "Wx",
          "time": [{
            "startTime": "2025-01-01T00:00:00+08:00",
            "elementValue": [{"value": "多雲"}]
          }]
        },
        {
          "elementName": "MinT",
          "time": [{
            "startTime": "2025-01-01T00:00:00+08:00",
            "elementValue": [{"value": "22"}]
          }]
        },
        {
          "elementName": "MaxT",
          "time": [{
            "startTime": "2025-01-01T00:00:00+08:00",
            "elementValue": [{"value": "28"}]
          }]
        }
      ]
    }]
  }
}
```

### 轉換為系統格式

系統會自動將 CWB 資料轉換為內部格式：

- **最低溫/最高溫** → `temperature` (平均溫度)
- **風速 (WS)** → `windSpeed` (m/s)
- **風向 (WD)** → `windDirection` (度)
- **降雨機率 (PoP)** → `rainfall` (預估降雨量)

## 🧪 測試配置

### 1. 檢查環境變數

確認 `.env` 檔案中的配置正確。

### 2. 重新啟動開發伺服器

```bash
npm run dev
```

### 3. 測試天氣資料

1. 進入 `/dashboard` 頁面
2. 選擇一個台灣地點（如：旗津、金山、都歷）
3. 查看天氣資料是否為真實資料

### 4. 測試聊天功能

1. 進入 `/chat` 頁面
2. 輸入：「幫我查詢旗津的天氣」
3. 確認顯示真實資料

## 🔍 故障排除

### 問題：API Key 錯誤

**解決方案**：
- 確認 API Key 是否正確：`CWA-265A4DB1-FD45-4491-971F-D0D6B92DB008`
- 確認 API Key 是否有效（未過期）
- 檢查 `.env` 檔案中的變數名稱是否正確

### 問題：找不到縣市

**解決方案**：
- 確認地點座標是否在台灣範圍內
- 系統會自動選擇最接近的縣市
- 如果地點不在標準縣市範圍內，會使用距離計算選擇最接近的縣市

### 問題：資料為空

**解決方案**：
- 確認 API 請求是否成功
- 檢查瀏覽器 Console 的錯誤訊息
- 確認日期範圍是否正確
- CWB API 可能需要一些時間更新資料

### 問題：仍然使用 Mock 資料

**解決方案**：
- 確認 `VITE_USE_REAL_WEATHER=true`
- 確認 `VITE_WEATHER_PROVIDER=cwb`
- 確認 `VITE_USE_MOCK_DATA=false`
- 重新啟動開發伺服器

## 📝 注意事項

1. **資料更新頻率**: CWB 天氣預報每 12 小時更新一次
2. **預報時效**: 36 小時的預報資料
3. **資料格式**: 系統會自動將每 12 小時的資料插值為每小時資料
4. **縣市範圍**: 僅限台灣地區
5. **API 限制**: 請遵守中央氣象署的使用條款

## 💡 使用建議

### 開發環境

- 可以使用 Mock 資料進行開發
- 設定 `VITE_USE_MOCK_DATA=true`

### 生產環境

- 使用真實 CWB API 資料
- 設定 `VITE_USE_REAL_WEATHER=true`
- 設定 `VITE_WEATHER_PROVIDER=cwb`
- 注意 API 使用限制

## 📊 資料對照

| CWB 欄位 | 系統欄位 | 單位 | 說明 |
|---------|---------|------|------|
| MinT | temperature | °C | 最低溫（用於計算平均） |
| MaxT | temperature | °C | 最高溫（用於計算平均） |
| WS | windSpeed | m/s | 風速 |
| WD | windDirection | 度 | 風向 (0-360) |
| PoP | rainfall | mm | 降雨機率（轉換為預估降雨量） |

## 🔗 相關資源

- 中央氣象署開放資料平台：https://opendata.cwb.gov.tw/
- API 文件：https://opendata.cwb.gov.tw/dist/opendata-swagger.html
- 資料集說明：F-C0032-001 (一般天氣預報-今明36小時天氣預報)

---

**需要更多幫助？** 請查看 [WEATHER_SEA_STATE_SETUP.md](./WEATHER_SEA_STATE_SETUP.md) 或提交 Issue。

