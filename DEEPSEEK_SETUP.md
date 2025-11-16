# 🚀 DeepSeek R1 快速配置指南

本指南說明如何設定 DeepSeek R1 作為您的 AI 聊天服務，支援**本地**和**遠端**兩種模式。

## 📝 選擇模式

### 模式 1: 本地 DeepSeek R1（推薦）⭐

如果您在本地運行 DeepSeek R1 服務：

```env
# AI 服務配置 - 使用本地 DeepSeek
VITE_AI_PROVIDER=deepseek

# 標記為本地 API
VITE_DEEPSEEK_IS_LOCAL=true

# 本地 API 地址（根據您的本地服務調整）
VITE_DEEPSEEK_BASE_URL=http://localhost:8000/v1
# 或
# VITE_DEEPSEEK_BASE_URL=http://127.0.0.1:8000/v1

# DeepSeek 模型名稱
VITE_DEEPSEEK_MODEL=deepseek-reasoner

# 本地 API 可能不需要 API Key，如果需要請設定
# VITE_DEEPSEEK_API_KEY=your-local-api-key

# 使用真實 API（設為 false）
VITE_USE_MOCK_DATA=false
```

### 模式 2: 遠端 DeepSeek API

如果您使用 DeepSeek 官方 API：

1. 前往 DeepSeek 平台：https://platform.deepseek.com/
2. 登入或註冊帳號
3. 進入 API Keys 頁面：https://platform.deepseek.com/api_keys
4. 建立新的 API Key 並複製

```env
# AI 服務配置 - 使用遠端 DeepSeek
VITE_AI_PROVIDER=deepseek

# 標記為遠端 API
VITE_DEEPSEEK_IS_LOCAL=false

# DeepSeek API Key
VITE_DEEPSEEK_API_KEY=sk-your-api-key-here

# DeepSeek 模型（推薦使用 deepseek-reasoner 即 R1）
VITE_DEEPSEEK_MODEL=deepseek-reasoner

# DeepSeek API 端點（通常不需要修改）
VITE_DEEPSEEK_BASE_URL=https://api.deepseek.com/v1

# 使用真實 API（設為 false）
VITE_USE_MOCK_DATA=false
```

## ⚙️ 步驟 2: 設定環境變數

在專案根目錄建立或編輯 `.env` 檔案，根據您選擇的模式填入對應的配置。

## 🎯 可用的 DeepSeek 模型

### 本地模型
- `deepseek-reasoner` - DeepSeek R1 推理模型（推薦）⭐
- `deepseek-chat` - DeepSeek Chat 模型
- 或您本地服務支援的其他模型名稱

### 遠端模型
- `deepseek-reasoner` - DeepSeek R1 推理模型（推薦）⭐
- `deepseek-chat` - DeepSeek Chat 模型
- `deepseek-coder` - 程式碼專用模型

## 🏠 本地 DeepSeek 服務設定

### 常見的本地 DeepSeek 服務端口

- `http://localhost:8000` - 常見的本地 API 端口
- `http://127.0.0.1:8000` - 使用 IP 地址
- `http://localhost:11434` - Ollama 常見端口（如果使用 Ollama）
- 其他自訂端口

### 確認本地服務運行

在瀏覽器或使用 curl 測試：

```bash
# 測試本地 API 是否運行
curl http://localhost:8000/v1/models

# 或測試聊天端點
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-reasoner",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 本地服務 API 格式

確保您的本地 DeepSeek 服務支援 OpenAI 相容的 API 格式：

```
POST /v1/chat/completions
Content-Type: application/json

{
  "model": "deepseek-reasoner",
  "messages": [
    {"role": "user", "content": "用戶訊息"}
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

回應格式：
```json
{
  "choices": [{
    "message": {
      "content": "AI 回應內容"
    }
  }]
}
```

## ✅ 步驟 3: 驗證設定

1. 重新啟動開發伺服器：
```bash
npm run dev
```

2. 進入聊天頁面 (`/chat`)

3. 發送測試訊息，例如：「你好，幫我查詢旗津的天氣」

4. 如果看到 AI 回應，表示設定成功！

## 🔍 故障排除

### 問題：本地 API 連線失敗
**解決方案**：
- 確認本地 DeepSeek 服務正在運行
- 確認 `VITE_DEEPSEEK_BASE_URL` 中的端口號是否正確
- 確認 `VITE_DEEPSEEK_IS_LOCAL=true` 已設定
- 檢查防火牆是否阻擋本地連線
- 嘗試使用 `http://127.0.0.1` 代替 `http://localhost`

### 問題：API Key 錯誤（遠端模式）
**解決方案**：
- 確認 API Key 是否正確複製（包含 `sk-` 前綴）
- 確認 API Key 是否有效（未過期或被撤銷）
- 檢查 `.env` 檔案中的變數名稱是否正確
- 本地模式可能不需要 API Key，確認 `VITE_DEEPSEEK_IS_LOCAL=true`

### 問題：網路連線錯誤
**解決方案**：
- 確認網路連線正常
- 檢查是否有防火牆阻擋
- 確認 `VITE_DEEPSEEK_BASE_URL` 是否正確

### 問題：模型不存在
**解決方案**：
- 確認模型名稱是否正確
- 檢查 DeepSeek 平台是否支援該模型
- 嘗試使用 `deepseek-chat` 作為替代

### 問題：仍然使用 Mock 模式
**解決方案**：
- 確認 `VITE_USE_MOCK_DATA=false`
- 確認 `VITE_AI_PROVIDER=deepseek`
- 確認本地服務正在運行（如果使用本地模式）
- 重新啟動開發伺服器
- 清除瀏覽器快取

## 📊 查看 Console 日誌

如果遇到問題，開啟瀏覽器開發者工具（F12），查看 Console 是否有錯誤訊息。

常見錯誤訊息：
- `DeepSeek API Key 未設定` - 檢查 `.env` 檔案
- `DeepSeek API 錯誤: ...` - 查看具體錯誤訊息
- `AI 服務失敗，使用 Mock 模式` - API 調用失敗，已自動回退

## 💡 提示

1. **API Key 安全**：`.env` 檔案已加入 `.gitignore`，不會被提交到 Git
2. **費用**：DeepSeek 有免費額度，請查看官方定價頁面
3. **速率限制**：注意 API 調用頻率限制
4. **模型選擇**：`deepseek-reasoner` 適合需要邏輯推理的對話，`deepseek-chat` 適合一般對話

## 🔗 相關連結

- DeepSeek 官方網站：https://www.deepseek.com/
- DeepSeek API 文檔：https://platform.deepseek.com/docs
- API Keys 管理：https://platform.deepseek.com/api_keys

---

**需要更多幫助？** 請查看 [API_INTEGRATION.md](./API_INTEGRATION.md) 或提交 Issue。

