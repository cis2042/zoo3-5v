# ZOO3 - 區塊鏈獎勵任務平台

ZOO3 是一個綜合性的區塊鏈獎勵任務平台，用戶可以通過完成各種任務獲取虛擬代幣。平台支持 LINE 錢包集成，每日簽到系統，任務中心，以及用戶推薦機制。

## 演示

您可以通過以下鏈接訪問 ZOO3 平台的演示版本：

🔗 [ZOO3 演示](https://cis2042.github.io/zoo3-5v/)

> **注意**：演示版本僅展示 UI 界面，實際功能需要連接到 Kaia Chain 和 Supabase 後端。

## 功能特點

- **每日簽到獎勵**：用戶每天登入可獲得 KAIA 代幣獎勵
- **任務系統**：完成各種任務獲得 ZOO 代幣
- **WBTC 錢包**：在 Kaia Chain 上管理 WBTC 代幣
- **推薦系統**：邀請朋友加入獲得雙方獎勵

## 技術棧

- **前端**：Next.js, React, TypeScript, Tailwind CSS
- **後端**：Supabase (PostgreSQL, Auth, Storage)
- **區塊鏈**：Kaia Chain, WBTC 智能合約
- **身份驗證**：LINE Login, Supabase Auth

## 本地開發

1. 克隆倉庫：
   ```bash
   git clone https://github.com/cis2042/zoo3-5v.git
   cd zoo3-5v
   ```

2. 安裝依賴：
   ```bash
   npm install
   ```

3. 創建 `.env.local` 文件並設置環境變數：
   ```
   # Supabase 配置
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # LINE LIFF 配置
   NEXT_PUBLIC_LIFF_ID=your_line_liff_id

   # WBTC API 配置 (Kaia Chain)
   NEXT_PUBLIC_KAIA_RPC_URL=https://rpc.kaiachain.io
   NEXT_PUBLIC_WBTC_CONTRACT_ADDRESS=your_wbtc_contract_address
   ```

4. 啟動開發服務器：
   ```bash
   npm run dev
   ```

5. 訪問 `http://localhost:3000` 查看應用

## WBTC API 整合 (Kaia Chain)

本項目使用 ethers.js 與 Kaia Chain 上的 WBTC 代幣進行交互。主要功能包括：

- 查詢 WBTC 餘額
- 獲取 WBTC 交易歷史
- 發送 WBTC 交易

詳細的 API 整合指南請參考 [WBTC API 整合指南](https://github.com/cis2042/zoo3-5v/blob/main/docs/wbtc-api-guide.md)。

## 貢獻

歡迎提交 Pull Request 或創建 Issue 來改進項目。

## 許可證

MIT
