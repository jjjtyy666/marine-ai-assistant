# 🏠 本地 DeepSeek R1 配置指南

本指南專門說明如何配置**本地運行**的 DeepSeek R1 服務。

## 🎯 快速配置

在專案根目錄的 `.env` 檔案中設定：

```env
# 使用 DeepSeek 作為 AI 服務
VITE_AI_PROVIDER=deepseek

# 標記為本地 API
VITE_DEEPSEEK_IS_LOCAL=true

# 本地 API 地址（根據您的本地服務調整）
VITE_DEEPSEEK_BASE_URL=http://localhost:8000/v1

# DeepSeek 模型名稱（根據您的本地模型調整）
VITE_DEEPSEEK_MODEL=deepseek-reasoner

# 本地 API 可能不需要 API Key，如果需要請取消註解並設定
# VITE_DEEPSEEK_API_KEY=your-local-api-key

# 使用真實 API（設為 false）
VITE_USE_MOCK_DATA=false
```

## 🔧 常見本地服務配置

### 配置 1: 標準本地 API（端口 8000）

```env
VITE_AI_PROVIDER=deepseek
VITE_DEEPSEEK_IS_LOCAL=true
VITE_DEEPSEEK_BASE_URL=http://localhost:8000/v1
VITE_DEEPSEEK_MODEL=deepseek-reasoner
VITE_USE_MOCK_DATA=false
```

### 配置 2: 使用 IP 地址

```env
VITE_AI_PROVIDER=deepseek
VITE_DEEPSEEK_IS_LOCAL=true
VITE_DEEPSEEK_BASE_URL=http://127.0.0.1:8000/v1
VITE_DEEPSEEK_MODEL=deepseek-reasoner
VITE_USE_MOCK_DATA=false
```

### 配置 3: 自訂端口

```env
VITE_AI_PROVIDER=deepseek
VITE_DEEPSEEK_IS_LOCAL=true
VITE_DEEPSEEK_BASE_URL=http://localhost:11434/v1
VITE_DEEPSEEK_MODEL=deepseek-reasoner
VITE_USE_MOCK_DATA=false
```

### 配置 4: 需要 API Key 的本地服務

```env
VITE_AI_PROVIDER=deepseek
VITE_DEEPSEEK_IS_LOCAL=true
VITE_DEEPSEEK_BASE_URL=http://localhost:8000/v1
VITE_DEEPSEEK_MODEL=deepseek-reasoner
VITE_DEEPSEEK_API_KEY=your-local-api-key
VITE_USE_MOCK_DATA=false
```

## ✅ 測試本地服務

### 1. 確認服務運行

在終端執行：

```bash
# 測試服務是否運行
curl http://localhost:8000/v1/models

# 或使用 PowerShell (Windows)
Invoke-WebRequest -Uri http://localhost:8000/v1/models
```

### 2. 測試聊天端點

```bash
curl http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek-reasoner",
    "messages": [{"role": "user", "content": "你好"}],
    "temperature": 0.7,
    "max_tokens": 200
  }'
```

### 3. 在瀏覽器測試

啟動專案後，進入 `/chat` 頁面，發送測試訊息。

## 🔍 故障排除

### 問題：無法連接到本地服務

**檢查清單**：
1. ✅ 確認本地 DeepSeek 服務正在運行
2. ✅ 確認端口號是否正確（檢查 `VITE_DEEPSEEK_BASE_URL`）
3. ✅ 確認 `VITE_DEEPSEEK_IS_LOCAL=true`
4. ✅ 嘗試使用 `127.0.0.1` 代替 `localhost`
5. ✅ 檢查防火牆設定
6. ✅ 查看瀏覽器 Console 的錯誤訊息

### 問題：CORS 錯誤

如果看到 CORS 錯誤，需要在本地服務端設定 CORS：

**Python Flask 範例**：
```python
from flask_cors import CORS
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])
```

**Node.js Express 範例**：
```javascript
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173'
}));
```

### 問題：API 格式不匹配

確保您的本地服務支援 OpenAI 相容的 API 格式：

**請求格式**：
```json
POST /v1/chat/completions
{
  "model": "deepseek-reasoner",
  "messages": [
    {"role": "user", "content": "訊息內容"}
  ],
  "temperature": 0.7,
  "max_tokens": 2000
}
```

**回應格式**：
```json
{
  "choices": [{
    "message": {
      "role": "assistant",
      "content": "回應內容"
    }
  }]
}
```

## 📝 常見本地服務

### Ollama

如果使用 Ollama 運行 DeepSeek：

```env
VITE_AI_PROVIDER=deepseek
VITE_DEEPSEEK_IS_LOCAL=true
VITE_DEEPSEEK_BASE_URL=http://localhost:11434/v1
VITE_DEEPSEEK_MODEL=deepseek-r1:latest
VITE_USE_MOCK_DATA=false
```

### vLLM / Text Generation Inference

```env
VITE_AI_PROVIDER=deepseek
VITE_DEEPSEEK_IS_LOCAL=true
VITE_DEEPSEEK_BASE_URL=http://localhost:8000/v1
VITE_DEEPSEEK_MODEL=deepseek-reasoner
VITE_USE_MOCK_DATA=false
```

### 自訂服務

根據您的服務配置調整 `VITE_DEEPSEEK_BASE_URL` 和 `VITE_DEEPSEEK_MODEL`。

## 🚀 啟動步驟

1. **啟動本地 DeepSeek 服務**
   ```bash
   # 根據您的服務執行對應的啟動命令
   # 例如：python server.py 或 ollama serve
   ```

2. **確認服務運行**
   ```bash
   curl http://localhost:8000/v1/models
   ```

3. **設定 .env 檔案**
   ```env
   VITE_AI_PROVIDER=deepseek
   VITE_DEEPSEEK_IS_LOCAL=true
   VITE_DEEPSEEK_BASE_URL=http://localhost:8000/v1
   VITE_DEEPSEEK_MODEL=deepseek-reasoner
   VITE_USE_MOCK_DATA=false
   ```

4. **啟動前端**
   ```bash
   npm run dev
   ```

5. **測試**
   - 進入 `http://localhost:5173/chat`
   - 發送測試訊息

## 💡 提示

- 本地服務通常不需要 API Key，但如果您的服務需要，請設定 `VITE_DEEPSEEK_API_KEY`
- 如果使用不同的端口，記得修改 `VITE_DEEPSEEK_BASE_URL`
- 確保本地服務支援 OpenAI 相容的 API 格式
- 開發時建議同時開啟本地服務和前端，方便調試

---

**需要更多幫助？** 請查看 [DEEPSEEK_SETUP.md](./DEEPSEEK_SETUP.md) 或 [API_INTEGRATION.md](./API_INTEGRATION.md)

