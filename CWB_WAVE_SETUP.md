# 🌊 中央氣象署波浪預報 API 配置指南

本指南說明如何配置中央氣象署 (CWB) 的波浪預報 API 來取得真實海況資料。

## 📋 API 資訊

- **資料集名稱**: 臺灣海域波浪預報逐三小時數值模式資料
- **資料集 ID**: F-A0021-001
- **資料內容**: 
  - 浪高 (hs) - 單位：公尺
  - 週期 (t) - 單位：秒
  - 波向 (dir) - 單位：度（0-360）
- **更新頻率**: 每 3 小時
- **預報時效**: 72 小時

## ⚙️ 配置步驟

### 1. 取得 API Key

您已經有 API Key：
```
CWA-265A4DB1-FD45-4491-971F-D0D6B92DB008
```

### 2. 在 .env 檔案中設定

```env
# 啟用真實海況資料
VITE_USE_REAL_SEA_STATE=true

# 使用中央氣象署作為海況資料來源
VITE_SEA_STATE_PROVIDER=cwb

# 中央氣象署 API Key
VITE_CWB_API_KEY=CWA-265A4DB1-FD45-4491-971F-D0D6B92DB008

# 使用真實 API（設為 false）
VITE_USE_MOCK_DATA=false
```

### 3. 完整配置範例

```env
# ============================================
# 海況資料配置 - 使用中央氣象署
# ============================================
VITE_USE_REAL_SEA_STATE=true
VITE_SEA_STATE_PROVIDER=cwb
VITE_CWB_API_KEY=CWA-265A4DB1-FD45-4491-971F-D0D6B92DB008

# ============================================
# 其他配置
# ============================================
VITE_USE_MOCK_DATA=false
```

## 🗺️ 支援的海域區域

系統會根據地點座標自動選擇最接近的海域區域：

- **臺灣海峽北部** (24.5°N - 26.0°N, 119.5°E - 121.0°E)
- **臺灣海峽南部** (22.5°N - 24.5°N, 119.0°E - 121.0°E)
- **臺灣東北部** (24.5°N - 26.0°N, 121.0°E - 122.5°E)
- **臺灣東部** (22.5°N - 24.5°N, 121.0°E - 122.5°E)
- **臺灣東南部** (21.0°N - 22.5°N, 120.5°E - 122.0°E)

## 📊 資料格式說明

### CWB API 回應格式

```json
{
  "records": {
    "location": [{
      "locationName": "臺灣海峽南部",
      "weatherElement": [
        {
          "elementName": "hs",
          "time": [{
            "startTime": "2025-01-01T00:00:00+08:00",
            "elementValue": [{"value": "1.2"}]
          }]
        },
        {
          "elementName": "t",
          "time": [{
            "startTime": "2025-01-01T00:00:00+08:00",
            "elementValue": [{"value": "8.5"}]
          }]
        },
        {
          "elementName": "dir",
          "time": [{
            "startTime": "2025-01-01T00:00:00+08:00",
            "elementValue": [{"value": "180"}]
          }]
        }
      ]
    }]
  }
}
```

### 轉換為系統格式

系統會自動將 CWB 資料轉換為內部格式：

- **浪高 (hs)** → `waveHeight` (公尺)
- **週期 (t)** → `wavePeriod` (秒)
- **波向 (dir)** → `waveDirection` (度)

## 🧪 測試配置

### 1. 檢查環境變數

確認 `.env` 檔案中的配置正確。

### 2. 重新啟動開發伺服器

```bash
npm run dev
```

### 3. 測試海況資料

1. 進入 `/dashboard` 頁面
2. 選擇一個台灣海域地點（如：旗津、金山、都歷）
3. 查看海況資料是否為真實資料

### 4. 測試聊天功能

1. 進入 `/chat` 頁面
2. 輸入：「幫我查詢旗津的海況」
3. 確認顯示真實資料

## 🔍 故障排除

### 問題：API Key 錯誤

**解決方案**：
- 確認 API Key 是否正確：`CWA-265A4DB1-FD45-4491-971F-D0D6B92DB008`
- 確認 API Key 是否有效（未過期）
- 檢查 `.env` 檔案中的變數名稱是否正確

### 問題：找不到海域區域

**解決方案**：
- 確認地點座標是否在台灣海域範圍內
- 系統會自動選擇最接近的區域
- 如果地點不在標準區域內，會使用距離計算選擇最接近的區域

### 問題：資料為空

**解決方案**：
- 確認 API 請求是否成功
- 檢查瀏覽器 Console 的錯誤訊息
- 確認日期範圍是否正確
- CWB API 可能需要一些時間更新資料

### 問題：仍然使用 Mock 資料

**解決方案**：
- 確認 `VITE_USE_REAL_SEA_STATE=true`
- 確認 `VITE_SEA_STATE_PROVIDER=cwb`
- 確認 `VITE_USE_MOCK_DATA=false`
- 重新啟動開發伺服器

## 📝 注意事項

1. **資料更新頻率**: CWB 波浪預報每 3 小時更新一次
2. **預報時效**: 最多 72 小時的預報資料
3. **資料格式**: 系統會自動將每 3 小時的資料轉換為每小時資料（使用插值）
4. **海域範圍**: 僅限台灣周邊海域
5. **API 限制**: 請遵守中央氣象署的使用條款

## 🔗 相關資源

- 中央氣象署開放資料平台：https://opendata.cwb.gov.tw/
- API 文件：https://opendata.cwb.gov.tw/dist/opendata-swagger.html
- 資料集說明：F-A0021-001 (臺灣海域波浪預報逐三小時數值模式資料)

## 💡 使用建議

### 開發環境

- 可以使用 Mock 資料進行開發
- 設定 `VITE_USE_MOCK_DATA=true`

### 生產環境

- 使用真實 CWB API 資料
- 設定 `VITE_USE_REAL_SEA_STATE=true`
- 設定 `VITE_SEA_STATE_PROVIDER=cwb`
- 注意 API 使用限制

## 📊 資料對照

| CWB 欄位 | 系統欄位 | 單位 | 說明 |
|---------|---------|------|------|
| hs | waveHeight | 公尺 | 浪高 |
| t | wavePeriod | 秒 | 週期 |
| dir | waveDirection | 度 | 波向 (0-360) |

---

**需要更多幫助？** 請查看 [WEATHER_SEA_STATE_SETUP.md](./WEATHER_SEA_STATE_SETUP.md) 或提交 Issue。

