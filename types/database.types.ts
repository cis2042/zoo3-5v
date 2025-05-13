export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          title: string
          description: string
          reward_amount: number
          reward_token: string
          created_at: string
          task_type: string
          redirect_url: string | null
        }
        Insert: {
          id?: string
          title: string
          description: string
          reward_amount: number
          reward_token: string
          created_at?: string
          task_type: string
          redirect_url?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string
          reward_amount?: number
          reward_token?: string
          created_at?: string
          task_type?: string
          redirect_url?: string | null
        }
        Relationships: []
      }
      task_completions: {
        Row: {
          id: string
          user_id: string
          task_id: string
          completed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          task_id: string
          completed_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string
          completed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_completions_task_id_fkey"
            columns: ["task_id"]
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_completions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          token: string
          transaction_type: string
          created_at: string
          reference_id: string | null
          description: string | null
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          token: string
          transaction_type: string
          created_at?: string
          reference_id?: string | null
          description?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          token?: string
          transaction_type?: string
          created_at?: string
          reference_id?: string | null
          description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string | null
          avatar_url: string | null
          total_tasks_completed: number
          total_kaia: number
          total_zoo: number
          total_wbtc: number
          login_streak: number
          last_login_date: string | null
          created_at: string
          referral_code: string
        }
        Insert: {
          id?: string
          user_id: string
          display_name?: string | null
          avatar_url?: string | null
          total_tasks_completed?: number
          total_kaia?: number
          total_zoo?: number
          total_wbtc?: number
          login_streak?: number
          last_login_date?: string | null
          created_at?: string
          referral_code?: string
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string | null
          avatar_url?: string | null
          total_tasks_completed?: number
          total_kaia?: number
          total_zoo?: number
          total_wbtc?: number
          login_streak?: number
          last_login_date?: string | null
          created_at?: string
          referral_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referee_id: string
          created_at: string
          reward_claimed: boolean
        }
        Insert: {
          id?: string
          referrer_id: string
          referee_id: string
          created_at?: string
          reward_claimed?: boolean
        }
        Update: {
          id?: string
          referrer_id?: string
          referee_id?: string
          created_at?: string
          reward_claimed?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referee_id_fkey"
            columns: ["referee_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      login_streaks: {
        Row: {
          id: string
          user_id: string
          streak_days: number
          current_day: number
          last_claimed_at: string | null
          days_completed: string[] // Array of completed days (1-7)
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          streak_days?: number
          current_day?: number
          last_claimed_at?: string | null
          days_completed?: string[] 
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          streak_days?: number
          current_day?: number
          last_claimed_at?: string | null
          days_completed?: string[]
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "login_streaks_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          achievement_type: string
          achievement_level: number
          unlocked_at: string
          current_progress: number
          next_target: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          achievement_type: string
          achievement_level: number
          unlocked_at: string
          current_progress: number
          next_target: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          achievement_type?: string
          achievement_level?: number
          unlocked_at?: string
          current_progress?: number
          next_target?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievements_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}