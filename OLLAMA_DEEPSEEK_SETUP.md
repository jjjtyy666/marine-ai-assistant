# 🦙 Ollama + DeepSeek R1 配置指南

本指南專門說明如何配置 **Ollama** 運行的本地 DeepSeek R1 服務。

## ✅ 確認 Ollama 運行狀態

您的 Ollama 服務正在運行：
- **端口**: `11434`
- **已安裝模型**: `deepseek-r1:latest` ✅

## ⚙️ 快速配置

在專案根目錄的 `.env` 檔案中設定：

```env
# 使用 DeepSeek 作為 AI 服務
VITE_AI_PROVIDER=deepseek

# 標記為本地 API
VITE_DEEPSEEK_IS_LOCAL=true

# Ollama API 地址（端口 11434）
VITE_DEEPSEEK_BASE_URL=http://localhost:11434/v1

# Ollama 中的模型名稱
VITE_DEEPSEEK_MODEL=deepseek-r1:latest

# Ollama 通常不需要 API Key
# VITE_DEEPSEEK_API_KEY=

# 使用真實 API（設為 false）
VITE_USE_MOCK_DATA=false
```

## 🎯 可用的模型

根據您的 Ollama 安裝，可以使用以下模型：

- `deepseek-r1:latest` ⭐ **推薦** - DeepSeek R1 最新版本
- `deepseek-r1:7b` - DeepSeek R1 7B 版本
- `deepseek-llm:7b-chat` - DeepSeek LLM 聊天版本

## 🧪 測試配置

### 1. 測試 Ollama API

在 PowerShell 中執行：

```powershell
$body = @{
    model = "deepseek-r1:latest"
    messages = @(
        @{role = "user"; content = "你好"}
    )
} | ConvertTo-Json -Depth 10

Invoke-WebRequest -Uri "http://localhost:11434/v1/chat/completions" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

### 2. 測試前端

1. 設定 `.env` 檔案（如上所示）
2. 重新啟動開發伺服器：
   ```bash
   npm run dev
   ```
3. 進入 `/chat` 頁面
4. 發送測試訊息

## 🔧 常見問題

### Q: 如何確認 Ollama 正在運行？

```powershell
# 檢查端口
netstat -ano | findstr :11434

# 列出已安裝的模型
ollama list

# 測試 API
Invoke-WebRequest -Uri "http://localhost:11434/api/tags"
```

### Q: 如何啟動 Ollama？

如果 Ollama 沒有運行：

```powershell
# 啟動 Ollama 服務（通常會自動啟動）
# 如果沒有，可以手動啟動：
Start-Process "C:\Users\eric0\AppData\Local\Programs\Ollama\ollama.exe"
```

### Q: 如何下載其他 DeepSeek 模型？

```bash
# 下載 DeepSeek R1
ollama pull deepseek-r1:latest

# 下載其他版本
ollama pull deepseek-r1:7b
ollama pull deepseek-llm:7b-chat
```

### Q: 端口不是 11434？

如果您的 Ollama 使用不同端口，修改 `.env`：

```env
VITE_DEEPSEEK_BASE_URL=http://localhost:YOUR_PORT/v1
```

### Q: 使用 IP 地址而不是 localhost？

```env
VITE_DEEPSEEK_BASE_URL=http://127.0.0.1:11434/v1
```

## 📝 完整配置範例

```env
# ============================================
# Ollama + DeepSeek R1 配置
# ============================================

# AI 服務提供者
VITE_AI_PROVIDER=deepseek

# 本地模式
VITE_DEEPSEEK_IS_LOCAL=true

# Ollama API 端點
VITE_DEEPSEEK_BASE_URL=http://localhost:11434/v1

# 模型名稱（根據 ollama list 顯示的名稱）
VITE_DEEPSEEK_MODEL=deepseek-r1:latest

# API Key（Ollama 通常不需要）
# VITE_DEEPSEEK_API_KEY=

# 使用真實 API
VITE_USE_MOCK_DATA=false

# ============================================
# 其他配置（如果需要）
# ============================================
# VITE_API_BASE_URL=http://localhost:3000/api
```

## 🚀 啟動步驟

1. **確認 Ollama 運行**
   ```powershell
   netstat -ano | findstr :11434
   ```

2. **確認模型已安裝**
   ```bash
   ollama list
   ```

3. **設定 .env 檔案**
   ```env
   VITE_AI_PROVIDER=deepseek
   VITE_DEEPSEEK_IS_LOCAL=true
   VITE_DEEPSEEK_BASE_URL=http://localhost:11434/v1
   VITE_DEEPSEEK_MODEL=deepseek-r1:latest
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

- Ollama 的 OpenAI 相容 API 端點是 `/v1/chat/completions`
- 模型名稱必須與 `ollama list` 顯示的名稱完全一致
- Ollama 通常不需要 API Key
- 如果遇到 CORS 問題，Ollama 預設應該允許本地請求

## 🔗 相關連結

- Ollama 官方網站：https://ollama.ai/
- Ollama GitHub：https://github.com/ollama/ollama
- DeepSeek 模型：https://ollama.ai/library/deepseek-r1

---

**需要更多幫助？** 請查看 [LOCAL_DEEPSEEK_SETUP.md](./LOCAL_DEEPSEEK_SETUP.md) 或 [DEEPSEEK_SETUP.md](./DEEPSEEK_SETUP.md)

