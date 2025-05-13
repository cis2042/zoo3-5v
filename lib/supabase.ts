import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are missing. Make sure to set the environment variables.')
}

// Create a singleton Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Helper functions for user profile
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Exception in getUserProfile:', error)
    return null
  }
}

export async function updateUserProfile(userId: string, updates: any) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating user profile:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Exception in updateUserProfile:', error)
    return { success: false, error }
  }
}

// Helper function for tasks
export async function getTasks() {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching tasks:', error)
      return []
    }

    return data
  } catch (error) {
    console.error('Exception in getTasks:', error)
    return []
  }
}

export async function getCompletedTasks(userId: string) {
  try {
    const { data, error } = await supabase
      .from('task_completions')
      .select('task_id')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching completed tasks:', error)
      return []
    }

    return data.map(item => item.task_id)
  } catch (error) {
    console.error('Exception in getCompletedTasks:', error)
    return []
  }
}

export async function completeTask(userId: string, taskId: string) {
  try {
    const { data, error } = await supabase.rpc('complete_task', {
      user_id: userId,
      task_id: taskId
    })

    if (error) {
      console.error('Error completing task:', error)
      return { success: false, error }
    }

    return data
  } catch (error) {
    console.error('Exception in completeTask:', error)
    return { success: false, error }
  }
}

// Helper function for login streak
export async function claimDailyReward(userId: string) {
  try {
    const { data, error } = await supabase.rpc('claim_daily_reward', {
      user_id: userId
    })

    if (error) {
      console.error('Error claiming daily reward:', error)
      return { success: false, error }
    }

    return data
  } catch (error) {
    console.error('Exception in claimDailyReward:', error)
    return { success: false, error }
  }
}

export async function getLoginStreak(userId: string) {
  try {
    const { data, error } = await supabase
      .from('login_streaks')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching login streak:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Exception in getLoginStreak:', error)
    return null
  }
}

// Helper functions for transactions
export async function getUserTransactions(userId: string) {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching transactions:', error)
      return []
    }

    return data
  } catch (error) {
    console.error('Exception in getUserTransactions:', error)
    return []
  }
}

// Helper functions for referrals
export async function processReferral(referralCode: string, userId: string) {
  try {
    const { data, error } = await supabase.rpc('process_referral', {
      referrer_code: referralCode,
      referee_id: userId
    })

    if (error) {
      console.error('Error processing referral:', error)
      return { success: false, error }
    }

    return data
  } catch (error) {
    console.error('Exception in processReferral:', error)
    return { success: false, error }
  }
}

export async function getUserReferrals(userId: string) {
  try {
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('referrer_id', userId)

    if (error) {
      console.error('Error fetching referrals:', error)
      return []
    }

    return data
  } catch (error) {
    console.error('Exception in getUserReferrals:', error)
    return []
  }
}

export async function getUserReferralCode(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('referral_code')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching referral code:', error)
      return null
    }

    return data.referral_code
  } catch (error) {
    console.error('Exception in getUserReferralCode:', error)
    return null
  }
}

// Helper functions for achievements
export async function getUserAchievements(userId: string) {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching achievements:', error)
      return []
    }

    return data
  } catch (error) {
    console.error('Exception in getUserAchievements:', error)
    return []
  }
}