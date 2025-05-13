# ZOO3 - 區塊鏈獎勵任務平台

ZOO3 是一個綜合性的區塊鏈獎勵任務平台，用戶可以通過完成各種任務獲取虛擬代幣。平台支持 LINE 錢包集成，每日簽到系統，任務中心，以及用戶推薦機制。

![ZOO3 Platform](https://raw.githubusercontent.com/cis2042/v0-line-ui-development/main/public/images/lion-logo.png)

## 目錄

- [技術棧](#技術棧)
- [項目結構](#項目結構)
- [環境變數](#環境變數)
- [API 文檔](#api-文檔)
- [數據庫架構](#數據庫架構)
- [核心功能](#核心功能)
- [開發指南](#開發指南)
- [部署指南](#部署指南)

## 技術棧

### 前端

- **Next.js**: React 框架，使用 App Router 架構
- **React**: 使用鉤子和函數式組件
- **TypeScript**: 靜態類型檢查
- **Tailwind CSS**: 原子化 CSS 框架
- **shadcn/ui**: 基於 Radix UI 的無樣式組件
- **LINE LIFF SDK**: LINE 前端框架整合

### 後端

- **Next.js API Routes**: API 端點服務
- **Supabase**: 後台即服務平台
  - PostgreSQL 數據庫
  - 用戶身份驗證
  - 行級安全策略 (RLS)
  - 存儲過程和函數

### 數據存儲

- **PostgreSQL**: 關係型數據庫
- **Supabase Auth**: 用戶身份驗證和會話管理
- **RLS 策略**: 強制數據訪問權限

## 項目結構

```
/
├── app/                      # 頁面和 API 路由
│   ├── api/                  # API 端點
│   │   ├── auth/             # 授權相關 API
│   │   ├── rewards/          # 獎勵相關 API
│   │   ├── tasks/            # 任務相關 API
│   │   ├── transactions/     # 交易相關 API
│   │   └── user/             # 用戶相關 API
│   ├── profile/              # 用戶資料頁面
│   ├── rewards/              # 獎勵頁面
│   ├── tasks/                # 任務頁面
│   └── liff/                 # LIFF 頁面
├── components/               # React 組件
│   ├── ui/                   # UI 組件 (shadcn/ui)
│   ├── bottom-navigation.tsx # 底部導航組件
│   └── lion-logo.tsx         # 平台 logo 組件
├── context/                  # React Context
│   └── auth-context.tsx      # 身份驗證 Context
├── hooks/                    # 自定義 React Hooks
│   ├── use-auth.ts           # 身份驗證 Hook
│   ├── use-rewards.ts        # 獎勵 Hook
│   ├── use-tasks.ts          # 任務 Hook
│   └── use-wallet.ts         # 錢包 Hook
├── lib/                      # 工具函數和共用邏輯
│   ├── auth.ts               # 授權工具函數
│   ├── liff.ts               # LINE LIFF 整合
│   ├── supabase.ts           # Supabase 客戶端和輔助函數
│   └── utils.ts              # 通用工具函數
├── public/                   # 靜態資源
│   └── images/               # 圖像資源
├── supabase/                 # Supabase 配置
│   └── migrations/           # 數據庫遷移腳本
├── types/                    # TypeScript 類型定義
│   └── database.types.ts     # 數據庫類型
└── styles/                   # 全局樣式
```

## 環境變數

項目需要以下環境變數才能正常運行：

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_LIFF_ID=your_line_liff_id
```

## API 文檔

### 用戶驗證與授權

#### LINE 登入
- **端點**: `/api/auth/line`
- **方法**: POST
- **參數**: { idToken, displayName, pictureUrl }
- **功能**: 使用 LINE ID Token 進行身份驗證

#### 一般註冊
- **端點**: `/api/auth/signup`
- **方法**: POST
- **參數**: { email, password, displayName, referralCode }
- **功能**: 註冊新用戶並處理推薦關係

#### OAuth 回調
- **端點**: `/api/auth/callback`
- **方法**: GET
- **功能**: 處理 OAuth 回調並建立會話

### 任務管理

#### 獲取任務列表
- **端點**: `/api/tasks`
- **方法**: GET
- **功能**: 獲取所有任務及用戶已完成的任務列表

#### 完成任務
- **端點**: `/api/tasks/complete`
- **方法**: POST
- **參數**: { taskId }
- **功能**: 標記任務為已完成並發放獎勵

### 獎勵管理

#### 領取每日獎勵
- **端點**: `/api/rewards/daily`
- **方法**: POST
- **功能**: 領取每日登入獎勵並更新連續登入記錄

### 用戶資料管理

#### 獲取用戶資料
- **端點**: `/api/user/profile`
- **方法**: GET
- **功能**: 獲取用戶資料、連續登入及成就記錄

#### 更新用戶資料
- **端點**: `/api/user/profile`
- **方法**: PUT
- **參數**: { displayName, avatarUrl }
- **功能**: 更新用戶資料

### 交易記錄

#### 獲取交易歷史
- **端點**: `/api/transactions`
- **方法**: GET
- **功能**: 獲取用戶的代幣交易歷史

### 推薦系統

#### 獲取推薦資料
- **端點**: `/api/referrals`
- **方法**: GET
- **功能**: 獲取用戶的推薦碼和推薦數據

#### 處理推薦關係
- **端點**: `/api/referrals`
- **方法**: POST
- **參數**: { referralCode }
- **功能**: 處理推薦關係並發放獎勵

## 數據庫架構

### 主要表格

#### tasks
- `id` (uuid): 主鍵
- `title` (text): 任務標題
- `description` (text): 任務說明
- `reward_amount` (numeric): 獎勵數量
- `reward_token` (text): 獎勵代幣類型 (KAIA, ZOO, WBTC)
- `task_type` (text): 任務類型 (discord, social_share, quiz, etc.)
- `redirect_url` (text): 任務重定向 URL
- `created_at` (timestamptz): 創建時間

#### task_completions
- `id` (uuid): 主鍵
- `user_id` (uuid): 用戶 ID (外鍵至 auth.users)
- `task_id` (uuid): 任務 ID (外鍵至 tasks)
- `completed_at` (timestamptz): 完成時間

#### transactions
- `id` (uuid): 主鍵
- `user_id` (uuid): 用戶 ID (外鍵至 auth.users)
- `amount` (numeric): 交易金額
- `token` (text): 代幣類型 (KAIA, ZOO, WBTC)
- `transaction_type` (text): 交易類型 (daily_reward, task_completion, referral_reward, etc.)
- `reference_id` (text): 參考 ID
- `description` (text): 交易說明
- `created_at` (timestamptz): 創建時間

#### user_profiles
- `id` (uuid): 主鍵
- `user_id` (uuid): 用戶 ID (外鍵至 auth.users)
- `display_name` (text): 顯示名稱
- `avatar_url` (text): 頭像 URL
- `total_tasks_completed` (integer): 已完成任務總數
- `total_kaia` (numeric): KAIA 代幣餘額
- `total_zoo` (numeric): ZOO 代幣餘額
- `total_wbtc` (numeric): WBTC 代幣餘額
- `login_streak` (integer): 連續登入天數
- `last_login_date` (timestamptz): 上次登入日期
- `referral_code` (text): 推薦碼
- `created_at` (timestamptz): 創建時間

#### referrals
- `id` (uuid): 主鍵
- `referrer_id` (uuid): 推薦人 ID (外鍵至 auth.users)
- `referee_id` (uuid): 被推薦人 ID (外鍵至 auth.users)
- `reward_claimed` (boolean): 獎勵是否已領取
- `created_at` (timestamptz): 創建時間

#### login_streaks
- `id` (uuid): 主鍵
- `user_id` (uuid): 用戶 ID (外鍵至 auth.users)
- `streak_days` (integer): 連續登入天數
- `current_day` (integer): 當前周期天數 (0-6)
- `last_claimed_at` (timestamptz): 上次領取獎勵時間
- `days_completed` (text[]): 已完成的天數 (陣列)
- `created_at` (timestamptz): 創建時間

#### achievements
- `id` (uuid): 主鍵
- `user_id` (uuid): 用戶 ID (外鍵至 auth.users)
- `achievement_type` (text): 成就類型
- `achievement_level` (integer): 成就等級
- `unlocked_at` (timestamptz): 解鎖時間
- `current_progress` (integer): 當前進度
- `next_target` (integer): 下一等級目標
- `created_at` (timestamptz): 創建時間

### 存儲過程

#### claim_daily_reward
- 處理每日獎勵領取
- 更新連續登入記錄和發放獎勵

#### complete_task
- 處理任務完成
- 標記任務為已完成並發放獎勵

#### process_referral
- 處理推薦關係
- 為推薦人和被推薦人發放獎勵

#### create_user_profile
- 在用戶註冊時自動創建資料
- 生成唯一推薦碼

## 核心功能

### 1. 用戶身份驗證
- 支持 LINE 登錄和傳統電子郵件/密碼登錄
- LINE LIFF 整合實現無縫體驗

### 2. 每日簽到系統
- 連續簽到獎勵
- 7天一個循環的獎勵機制
- 特殊第7天獎勵

### 3. 任務中心
- 多種任務類型 (社交分享, 社區加入, 測驗等)
- 不同代幣獎勵
- 任務狀態追蹤

### 4. 代幣獎勵系統
- 三種虛擬代幣: KAIA, ZOO, WBTC
- 獎勵交易記錄
- 代幣餘額管理

### 5. 推薦系統
- 唯一推薦碼
- 雙重獎勵機制 (推薦人和被推薦人均獲獎勵)
- 推薦追蹤

### 6. 成就系統
- 階梯式成就等級
- 基於用戶活動的自動解鎖
- 可視化成就進度

## 開發指南

### 安裝依賴

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 設置環境變數

1. 創建 `.env` 文件
2. 添加必要的環境變數

### 運行開發服務器

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 資料庫遷移

```bash
npx supabase migration up
```

### 連接到 Supabase 項目

1. 創建 Supabase 項目
2. 複製項目 URL 和匿名密鑰
3. 更新 `.env` 文件

### LINE LIFF 設置

1. 創建 LINE LIFF 應用
2. 設置回調 URL
3. 獲取 LIFF ID 並添加到環境變數

## 部署指南

### Vercel 部署

1. 連接 GitHub 倉庫到 Vercel
2. 設置環境變數
3. 部署項目

### 自定義域名設置

1. 在 Vercel dashboard 添加自定義域名
2. 配置 DNS 記錄
3. 等待域名生效

## 貢獻指南

1. Fork 倉庫
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

## 使用到的庫

- `@supabase/auth-helpers-nextjs`: Supabase 身份驗證輔助
- `@supabase/supabase-js`: Supabase JavaScript 客戶端
- `@line/liff`: LINE 前端框架
- `date-fns`: 日期處理
- `lucide-react`: 圖標庫
- `tailwindcss`: CSS 框架
- 及其他依賴...

## 授權

Licensed under the [MIT License](LICENSE).