// General types used across the application
import { Database } from './database.types'

export type Task = Database['public']['Tables']['tasks']['Row']
export type TaskCompletion = Database['public']['Tables']['task_completions']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'] & {
  referral_count?: number
}
export type Referral = Database['public']['Tables']['referrals']['Row']
export type LoginStreak = Database['public']['Tables']['login_streaks']['Row']
export type Achievement = Database['public']['Tables']['achievements']['Row']

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface TokenBalances {
  kaia: number
  zoo: number
  wbtc: number
}

export interface LoginStreakUI {
  currentDay: number
  lastClaimed: string | null
  days: Array<{
    reward: string
    completed: boolean
  }>
}

export interface ReferralData {
  referralCode: string
  referralCount: number
  referrals: Referral[]
}

export interface DailyRewardResult {
  success: boolean
  message?: string
  streak_days: number
  current_day: number
  days_completed: string[]
  reward_amount: number
  reward_token: string
}

export interface TaskCompletionResult {
  success: boolean
  message?: string
  reward_amount: number
  reward_token: string
}