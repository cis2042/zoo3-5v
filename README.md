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

本項目使用 Next.js API Routes 實現後端 API 功能，所有 API 端點都位於 `app/api/` 目錄下。API 使用 Supabase 進行數據存儲和身份驗證。

### API 認證機制

大多數 API 端點需要用戶身份驗證。認證通過 Supabase Auth 的會話 Cookie 實現：

1. 用戶登錄後，Supabase 會設置包含會話信息的 Cookie
2. 後續請求會自動包含這些 Cookie
3. 服務器端通過 `supabase.auth.getSession()` 獲取當前用戶會話
4. 如果會話無效或不存在，API 會返回 401 Unauthorized 錯誤

### 通用 API 響應格式

所有 API 端點都使用統一的響應格式：

```typescript
interface APIResponse<T> {
  success: boolean;       // 操作是否成功
  data?: T;               // 成功時返回的數據
  error?: string;         // 失敗時的錯誤信息
}
```

### 錯誤處理

API 使用 HTTP 狀態碼和錯誤消息來表示錯誤：

- **400 Bad Request**: 請求參數無效
- **401 Unauthorized**: 用戶未認證或認證已過期
- **403 Forbidden**: 用戶無權訪問資源
- **404 Not Found**: 資源不存在
- **500 Internal Server Error**: 服務器內部錯誤

### 用戶驗證與授權

#### LINE 登入
- **端點**: `/api/auth/line`
- **方法**: POST
- **請求體**:
  ```json
  {
    "idToken": "LINE_ID_TOKEN",
    "displayName": "用戶顯示名稱",
    "pictureUrl": "https://example.com/profile.jpg"
  }
  ```
- **成功響應** (200 OK):
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "user_id",
        "email": "email@example.com",
        "user_metadata": {
          "display_name": "用戶顯示名稱"
        }
      },
      "session": {
        "access_token": "...",
        "refresh_token": "...",
        "expires_at": 1234567890
      }
    }
  }
  ```
- **失敗響應** (400 Bad Request):
  ```json
  {
    "success": false,
    "error": "無效的 ID Token"
  }
  ```
- **實現文件**: `app/api/auth/line/route.ts`
- **功能**: 使用 LINE ID Token 進行身份驗證，創建或更新用戶資料，並建立 Supabase 會話

#### 一般註冊
- **端點**: `/api/auth/signup`
- **方法**: POST
- **請求體**:
  ```json
  {
    "email": "user@example.com",
    "password": "secure_password",
    "displayName": "用戶顯示名稱",
    "referralCode": "ABCDEF"  // 可選
  }
  ```
- **成功響應** (200 OK):
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "user_id",
        "email": "user@example.com",
        "user_metadata": {
          "display_name": "用戶顯示名稱"
        }
      },
      "session": {
        "access_token": "...",
        "refresh_token": "...",
        "expires_at": 1234567890
      }
    }
  }
  ```
- **失敗響應** (400 Bad Request):
  ```json
  {
    "success": false,
    "error": "電子郵件已被使用"
  }
  ```
- **實現文件**: `app/api/auth/signup/route.ts`
- **功能**: 註冊新用戶，處理推薦關係（如果提供了推薦碼），並建立 Supabase 會話

#### OAuth 回調
- **端點**: `/api/auth/callback`
- **方法**: GET
- **查詢參數**: `code` (由 OAuth 提供商提供)
- **功能**: 處理 OAuth 回調並建立會話
- **實現文件**: `app/api/auth/callback/route.ts`
- **備註**: 此端點主要用於 OAuth 流程，通常不需要直接調用

### 任務管理

#### 獲取任務列表
- **端點**: `/api/tasks`
- **方法**: GET
- **認證**: 可選（未認證用戶只能查看任務，無法查看完成狀態）
- **成功響應** (200 OK):
  ```json
  {
    "success": true,
    "data": {
      "tasks": [
        {
          "id": "task_id_1",
          "title": "加入 Discord 社區",
          "description": "加入 ZOO3 官方 Discord 社區並完成身份驗證",
          "reward_amount": 5,
          "reward_token": "ZOO",
          "task_type": "discord",
          "redirect_url": "https://discord.gg/zoo3",
          "created_at": "2025-03-01T08:30:00Z"
        },
        // 更多任務...
      ],
      "completedTasks": ["task_id_1", "task_id_3"]  // 已認證用戶才會返回
    }
  }
  ```
- **實現文件**: `app/api/tasks/route.ts`
- **功能**: 獲取所有任務及用戶已完成的任務列表

#### 完成任務
- **端點**: `/api/tasks/complete`
- **方法**: POST
- **認證**: 必須
- **請求體**:
  ```json
  {
    "taskId": "task_id_1"
  }
  ```
- **成功響應** (200 OK):
  ```json
  {
    "success": true,
    "data": {
      "message": "任務完成成功",
      "reward_amount": 5,
      "reward_token": "ZOO"
    }
  }
  ```
- **失敗響應** (400 Bad Request):
  ```json
  {
    "success": false,
    "error": "任務已完成"
  }
  ```
- **實現文件**: `app/api/tasks/complete/route.ts`
- **功能**: 標記任務為已完成並發放獎勵
- **備註**: 此端點調用 Supabase 存儲過程 `complete_task` 來處理任務完成邏輯

### 獎勵管理

#### 領取每日獎勵
- **端點**: `/api/rewards/daily`
- **方法**: POST
- **認證**: 必須
- **成功響應** (200 OK):
  ```json
  {
    "success": true,
    "data": {
      "message": "獎勵領取成功",
      "streak_days": 5,
      "current_day": 4,
      "days_completed": ["0", "1", "2", "3", "4"],
      "reward_amount": 2,
      "reward_token": "KAIA"
    }
  }
  ```
- **失敗響應** (400 Bad Request):
  ```json
  {
    "success": false,
    "error": "今日已領取獎勵"
  }
  ```
- **實現文件**: `app/api/rewards/daily/route.ts`
- **功能**: 領取每日登入獎勵並更新連續登入記錄
- **備註**: 此端點調用 Supabase 存儲過程 `claim_daily_reward` 來處理獎勵邏輯

### 用戶資料管理

#### 獲取用戶資料
- **端點**: `/api/user/profile`
- **方法**: GET
- **認證**: 必須
- **成功響應** (200 OK):
  ```json
  {
    "success": true,
    "data": {
      "profile": {
        "id": "profile_id",
        "user_id": "user_id",
        "display_name": "用戶顯示名稱",
        "avatar_url": "https://example.com/avatar.jpg",
        "total_tasks_completed": 10,
        "total_kaia": 25.0,
        "total_zoo": 45.0,
        "total_wbtc": 0.00025,
        "login_streak": 5,
        "last_login_date": "2025-05-12T09:00:00Z",
        "referral_code": "ABC123",
        "created_at": "2025-03-01T08:30:00Z"
      },
      "loginStreak": {
        "streak_days": 5,
        "current_day": 4,
        "days_completed": ["0", "1", "2", "3", "4"]
      },
      "achievements": [
        {
          "achievement_type": "login_streak",
          "achievement_level": 1,
          "current_progress": 5,
          "next_target": 7
        }
        // 更多成就...
      ]
    }
  }
  ```
- **實現文件**: `app/api/user/profile/route.ts`
- **功能**: 獲取用戶資料、連續登入及成就記錄

#### 更新用戶資料
- **端點**: `/api/user/profile`
- **方法**: PUT
- **認證**: 必須
- **請求體**:
  ```json
  {
    "displayName": "新顯示名稱",
    "avatarUrl": "https://example.com/new-avatar.jpg"
  }
  ```
- **成功響應** (200 OK):
  ```json
  {
    "success": true,
    "data": {
      "message": "資料更新成功",
      "profile": {
        "display_name": "新顯示名稱",
        "avatar_url": "https://example.com/new-avatar.jpg"
      }
    }
  }
  ```
- **實現文件**: `app/api/user/profile/route.ts`
- **功能**: 更新用戶資料

### 交易記錄

#### 獲取交易歷史
- **端點**: `/api/transactions`
- **方法**: GET
- **認證**: 必須
- **查詢參數**: `limit` (可選，默認 20), `offset` (可選，默認 0)
- **成功響應** (200 OK):
  ```json
  {
    "success": true,
    "data": {
      "transactions": [
        {
          "id": "transaction_id_1",
          "user_id": "user_id",
          "amount": 1.0,
          "token": "KAIA",
          "transaction_type": "daily_reward",
          "description": "每日簽到獎勵",
          "created_at": "2025-05-12T09:00:00Z"
        },
        {
          "id": "transaction_id_2",
          "user_id": "user_id",
          "amount": 5.0,
          "token": "ZOO",
          "transaction_type": "task_completion",
          "reference_id": "task_id_1",
          "description": "加入 Discord 社區",
          "created_at": "2025-05-10T14:30:00Z"
        }
        // 更多交易...
      ],
      "total": 15
    }
  }
  ```
- **實現文件**: `app/api/transactions/route.ts`
- **功能**: 獲取用戶的代幣交易歷史

### 推薦系統

#### 獲取推薦資料
- **端點**: `/api/referrals`
- **方法**: GET
- **認證**: 必須
- **成功響應** (200 OK):
  ```json
  {
    "success": true,
    "data": {
      "referralCode": "ABC123",
      "referralLink": "https://zoo3.app/register?ref=ABC123",
      "referrals": [
        {
          "id": "referral_id_1",
          "referee_id": "user_id_2",
          "referee_name": "被推薦用戶1",
          "reward_claimed": true,
          "created_at": "2025-04-15T10:30:00Z"
        }
        // 更多推薦...
      ],
      "totalReferrals": 5,
      "totalRewards": 50.0
    }
  }
  ```
- **實現文件**: `app/api/referrals/route.ts`
- **功能**: 獲取用戶的推薦碼和推薦數據

#### 處理推薦關係
- **端點**: `/api/referrals`
- **方法**: POST
- **認證**: 必須
- **請求體**:
  ```json
  {
    "referralCode": "ABC123"
  }
  ```
- **成功響應** (200 OK):
  ```json
  {
    "success": true,
    "data": {
      "message": "推薦處理成功",
      "reward_amount": 10,
      "reward_token": "ZOO"
    }
  }
  ```
- **失敗響應** (400 Bad Request):
  ```json
  {
    "success": false,
    "error": "無效的推薦碼"
  }
  ```
- **實現文件**: `app/api/referrals/route.ts`
- **功能**: 處理推薦關係並發放獎勵
- **備註**: 此端點調用 Supabase 存儲過程 `process_referral` 來處理推薦邏輯

### 如何使用 API

#### 前端調用示例

```typescript
// 使用 fetch API 調用
async function completeTask(taskId: string) {
  try {
    const response = await fetch('/api/tasks/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ taskId }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error);
    }

    return data.data;
  } catch (error) {
    console.error('Error completing task:', error);
    throw error;
  }
}
```

#### 使用自定義 Hook

本項目提供了多個自定義 Hook 來簡化 API 調用：

```typescript
// 使用自定義 Hook 調用
import { useTasks } from '@/hooks/use-tasks';

function TaskComponent() {
  const { tasks, completedTasks, completeTask, isLoading, error } = useTasks();

  // 使用 completeTask 函數完成任務
  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask(taskId);
      // 處理成功
    } catch (error) {
      // 處理錯誤
    }
  };

  // 渲染組件...
}
```

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

### Supabase 詳細設置指南

Supabase 是一個開源的 Firebase 替代品，提供數據庫、身份驗證、存儲和實時訂閱等功能。本項目使用 Supabase 作為後端服務。

#### 1. 創建 Supabase 帳戶和項目

1. 訪問 [Supabase 官網](https://supabase.com/) 並註冊帳戶
2. 登入後，點擊 "New Project" 創建新項目
3. 填寫項目名稱（例如 "zoo3-platform"）
4. 設置數據庫密碼（請妥善保存）
5. 選擇地區（建議選擇離用戶最近的地區）
6. 點擊 "Create new project"，等待項目創建完成（約 1-2 分鐘）

#### 2. 獲取項目憑證

1. 在項目儀表板中，點擊左側導航欄的 "Project Settings"
2. 選擇 "API" 選項卡
3. 在 "Project URL" 下找到您的 Supabase URL
4. 在 "Project API keys" 下找到 "anon" 公開密鑰
5. 將這兩個值複製到 `.env.local` 文件中：

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

#### 3. 設置數據庫架構

本項目使用 SQL 遷移文件來設置數據庫架構。遷移文件位於 `supabase/migrations/` 目錄下。

**方法 1: 使用 Supabase CLI（推薦）**

1. 安裝 Supabase CLI：
   ```bash
   # macOS
   brew install supabase/tap/supabase

   # Windows (使用 scoop)
   scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
   scoop install supabase
   ```

2. 登入 Supabase：
   ```bash
   supabase login
   ```

3. 初始化 Supabase 配置（如果尚未初始化）：
   ```bash
   supabase init
   ```

4. 鏈接到您的 Supabase 項目：
   ```bash
   supabase link --project-ref your-project-id
   ```
   （項目 ID 可以在 Supabase 儀表板的 URL 或項目設置中找到）

5. 運行遷移：
   ```bash
   supabase db push
   ```

**方法 2: 手動執行 SQL**

1. 在 Supabase 儀表板中，點擊左側導航欄的 "SQL Editor"
2. 創建新的查詢
3. 打開 `supabase/migrations/` 目錄下的 SQL 文件
4. 複製文件內容並粘貼到 SQL 編輯器中
5. 點擊 "Run" 執行 SQL 命令
6. 對每個遷移文件重複此過程

#### 4. 設置身份驗證

1. 在 Supabase 儀表板中，點擊左側導航欄的 "Authentication"
2. 在 "Providers" 選項卡中，啟用需要的身份驗證提供商：
   - Email（默認啟用）
   - 如需啟用 LINE 登錄，點擊 "LINE" 並配置 LINE 開發者帳戶的憑證

3. 在 "URL Configuration" 選項卡中，設置重定向 URL：
   - 本地開發：`http://localhost:3000/auth/callback`
   - 生產環境：`https://your-domain.com/auth/callback`

#### 5. 設置行級安全策略 (RLS)

Supabase 使用 PostgreSQL 的行級安全策略來控制數據訪問。遷移文件中已包含基本的 RLS 策略，但您可以根據需要進行調整：

1. 在 Supabase 儀表板中，點擊左側導航欄的 "Table Editor"
2. 選擇一個表格
3. 點擊 "Policies" 選項卡
4. 查看和修改現有策略，或創建新策略

#### 6. 測試連接

設置完成後，您可以通過運行應用程序來測試 Supabase 連接：

```bash
npm run dev
```

如果一切設置正確，應用程序應該能夠連接到 Supabase 並正常運行。

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