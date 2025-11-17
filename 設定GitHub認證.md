# GitHub 認證設定指南

## 方法 1：使用 Personal Access Token（推薦）

### 步驟 1：建立 Personal Access Token

1. 登入 GitHub，前往：https://github.com/settings/tokens
2. 點擊「Generate new token」→「Generate new token (classic)」
3. 設定：
   - **Note（備註）**：`marine-ai-assistant`（或任何你喜歡的名稱）
   - **Expiration（過期時間）**：選擇 `90 days` 或 `No expiration`
   - **Select scopes（權限）**：勾選 `repo`（完整倉庫權限）
4. 點擊「Generate token」
5. **重要**：複製產生的 token（只會顯示一次！）
   - 格式類似：`ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 步驟 2：使用 Token 推送

當 Git 要求輸入密碼時：
- **Username（用戶名）**：輸入你的 GitHub 用戶名（例如：`jjjtyy666`）
- **Password（密碼）**：**貼上剛才複製的 Personal Access Token**（不是你的 GitHub 密碼！）

### 步驟 3：儲存認證（可選）

Windows 可以使用 Git Credential Manager 自動儲存：

```batch
git config --global credential.helper manager-core
```

之後推送時，Windows 會自動儲存你的認證。

---

## 方法 2：使用 SSH 金鑰（更安全，推薦長期使用）

### 步驟 1：檢查是否已有 SSH 金鑰

```batch
dir %USERPROFILE%\.ssh
```

如果有 `id_rsa.pub` 或 `id_ed25519.pub`，跳到步驟 3。

### 步驟 2：產生新的 SSH 金鑰

```batch
ssh-keygen -t ed25519 -C "your_email@example.com"
```

- 按 Enter 使用預設路徑
- 可以設定密碼保護（建議）或直接按 Enter

### 步驟 3：複製公鑰

```batch
type %USERPROFILE%\.ssh\id_ed25519.pub
```

複製輸出的完整內容（從 `ssh-ed25519` 開始到結尾）。

### 步驟 4：添加到 GitHub

1. 前往：https://github.com/settings/keys
2. 點擊「New SSH key」
3. **Title**：輸入名稱（例如：`My Windows PC`）
4. **Key**：貼上剛才複製的公鑰
5. 點擊「Add SSH key」

### 步驟 5：更改遠端 URL 為 SSH

```batch
git remote set-url origin git@github.com:jjjtyy666/marine-ai-assistant.git
```

### 步驟 6：測試 SSH 連線

```batch
ssh -T git@github.com
```

如果看到 `Hi jjjtyy666! You've successfully authenticated...`，表示成功！

---

## 方法 3：使用 GitHub CLI（最簡單）

### 安裝 GitHub CLI

1. 下載：https://cli.github.com/
2. 安裝後執行：

```batch
gh auth login
```

選擇：
- GitHub.com
- HTTPS
- 登入方式（瀏覽器或 token）

完成後，Git 會自動使用 GitHub CLI 的認證。

---

## 快速推送指令

設定好認證後，在專案目錄執行：

```batch
cd "C:\Users\eric0\OneDrive\桌面\sea help front"
git init
git add .
git commit -m "初始提交：海洋 AI 助理前端專案"
git branch -M main
git remote add origin https://github.com/jjjtyy666/marine-ai-assistant.git
git push -u origin main
```

如果遠端已存在，先拉取：

```batch
git pull origin main --allow-unrelated-histories
git push -u origin main
```

---

## 常見問題

### Q: 推送時出現 "Authentication failed"
**A:** 確認：
- 使用 Personal Access Token 而不是密碼
- Token 有 `repo` 權限
- Token 未過期

### Q: 推送時出現 "remote: Repository not found"
**A:** 確認：
- 倉庫名稱正確：`jjjtyy666/marine-ai-assistant`
- 你有該倉庫的寫入權限
- 倉庫確實存在於 GitHub

### Q: 如何更新已儲存的認證？
**A:** Windows 憑證管理員：
1. 開啟「控制台」→「認證管理員」
2. 找到 `git:https://github.com`
3. 編輯或刪除後重新推送

---

## 推薦流程

1. **第一次使用**：方法 1（Personal Access Token）最簡單
2. **長期使用**：方法 2（SSH）更安全
3. **開發者**：方法 3（GitHub CLI）最方便

