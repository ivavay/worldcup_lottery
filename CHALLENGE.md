# 前端工程師面試實作測驗

## 專案簡介

本測驗使用一個基於 **Next.js App Router** 的 Web 專案：**2026 世界盃抽獎系統**。

請先參閱 [README.md](README.md) 了解專案功能與本機環境設定方式，接著將此專案從 GitHub **Fork** 到您自己的帳號下，並在 Fork 的儲存庫中完成以下各題目。

---

## 關於使用 AI Coding Agent

**本測驗全程鼓勵使用 AI Coding Agent 輔助開發、測試與文件撰寫。** 我們希望看到您如何善用 AI 工具提升工程效率，而非單純考核手動撰碼能力。

可使用的工具包含但不限於：

| 工具 | 備註 |
| --- | --- |
| [Claude Code](https://claude.ai/code) | |
| [OpenAI Codex](https://openai.com/codex) | |
| [GitHub Copilot](https://github.com/features/copilot) | 可能提供新用戶免費額度 |
| [Cursor](https://www.cursor.com/) | 可能提供新用戶免費額度 |
| [Trae](https://www.trae.ai/) | 可能提供新用戶免費額度 |
| [OpenCode](https://opencode.ai/) | |

> **提示：** 若您使用了 AI Coding Agent 的 Skills 功能（如 Claude Code Skills），請將使用的 Skills 檔案存放於儲存庫根目錄的 `.skills/` 資料夾下，並一併提交。

---

## 題目

### 題目一｜尋找並修復 UI Bug【必答題】

請在本機啟動此 Web 專案，仔細比對 [README.md](README.md) 中描述的**功能列表**，找出**至少一處**目前 UI 頁面上與功能描述不符的 Bug。

完成步驟如下：

1. **建立 Git Issue**：在您 Fork 的 GitHub 儲存庫中建立一個 Issue，清楚描述您發現的 Bug（包含問題現象、預期行為、重現步驟）。
2. **修復 Bug**：使用 AI Coding Agent（或手動方式）修復該問題，並在本機驗證修復結果。
3. **建立 Pull Request**：將修復的程式碼推送至 Fork 的儲存庫，並建立一個 Pull Request，PR 描述中請關聯至前一步建立的 Issue。
4. **關閉 Issue**：合併 Pull Request 後，關閉對應的 Git Issue。

---

### 題目二｜行動裝置響應式優化【必答題】

目前專案的前端介面僅針對桌面（PC）進行設計，在手機等行動裝置上的顯示效果不佳，操作體驗欠缺。

請對前端頁面進行**響應式優化或重構**，使其能夠同時在 **PC 桌面**與**手機**上正常顯示與操作，包含但不限於：

- 前台抽獎頁（`/`）
- 後台管理頁（`/admin`）
- 後台登入頁（`/admin/login`）

> 請確保優化後在不同螢幕寬度下均具備良好的可讀性與操作性。

---

### 題目三｜資料庫遷移與雲端部署【選做題】

目前專案後端使用本機 SQLite 資料庫儲存資料，僅適合單機使用，無法支援多人同時連線與抽獎。

請完成以下兩項工作：

#### 3-1. 將資料庫從 SQLite 遷移至 Supabase

- 在 [Supabase](https://supabase.com/) 建立一個新專案（可使用 GitHub 帳號免費登入）。
- 將 SQLite 的資料表遷移至 Supabase PostgreSQL 資料庫。
- 重構後端程式碼，以 Supabase 取代 SQLite 的資料存取邏輯，確保功能正常運作且支援多人同時存取。

#### 3-2. 部署至 Vercel

- 將專案部署至 [Vercel](https://vercel.com/)（可使用 GitHub 帳號免費登入並建立 Project）。
- 設定必要的環境變數。
- 確保部署後的線上版本可對外正常存取。

---

### 題目四｜提交答案【必答題】

完成上述題目後，請：

1. 確認所有程式碼已推送至您 Fork 的 GitHub 儲存庫。
2. 將該儲存庫設定為**公開（Public）**。
3. 將以下資訊以電子郵件寄送至指定信箱：
   - **GitHub 儲存庫 URL**（必填）
   - **Vercel 部署後的專案 URL**（若完成題目三，請一併提供）

---

*本專案僅供面試測驗目的使用，禁止商業用途。詳情請參閱 [LICENSE.md](LICENSE.md)。*
