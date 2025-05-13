"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/auth-context'
import { supabase } from '@/lib/supabase'
import { claimDailyReward } from '@/lib/supabase'
import { toast } from '@/components/ui/use-toast'

export interface LoginStreak {
  currentDay: number
  lastClaimed: string | null
  days: Array<{
    reward: string
    completed: boolean
  }>
}

export function useRewards() {
  const { user, refreshProfile } = useAuth()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loginStreak, setLoginStreak] = useState<LoginStreak>({
    currentDay: 0,
    lastClaimed: null,
    days: [
      { reward: "+1", completed: false },
      { reward: "+1", completed: false },
      { reward: "+2", completed: false },
      { reward: "+2", completed: false },
      { reward: "+3", completed: false },
      { reward: "+3", completed: false },
      { reward: "+10 🎁", completed: false },
    ],
  })
  const [todaysClaimed, setTodaysClaimed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Load transactions
  const loadTransactions = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setTransactions(data || [])
    } catch (error) {
      console.error('Error loading transactions:', error)
    }
  }
  
  // Load login streak
  const loadLoginStreak = async () => {
    if (!user) return
    
    try {
      const { data, error } = await supabase
        .from('login_streaks')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No streak found, use default
          return
        }
        throw error
      }
      
      if (data) {
        // Transform the data from the database to the format our UI expects
        const lastClaimed = data.last_claimed_at
        const currentDay = data.current_day
        const daysCompleted = data.days_completed || []
        
        // Check if already claimed today
        const today = new Date()
        const lastClaimedDate = lastClaimed ? new Date(lastClaimed) : null
        const isTodayClaimed = lastClaimedDate && 
          lastClaimedDate.getDate() === today.getDate() &&
          lastClaimedDate.getMonth() === today.getMonth() &&
          lastClaimedDate.getFullYear() === today.getFullYear()
        
        setTodaysClaimed(isTodayClaimed)
        
        // Update the UI state
        const newStreak = {
          currentDay: currentDay,
          lastClaimed: lastClaimed,
          days: loginStreak.days.map((day, index) => ({
            ...day,
            completed: daysCompleted.includes(index.toString())
          }))
        }
        
        setLoginStreak(newStreak)
      }
    } catch (error) {
      console.error('Error loading login streak:', error)
    }
  }
  
  // Claim daily reward
  const claimDaily = async () => {
    if (!user || todaysClaimed) return
    
    setIsLoading(true)
    
    try {
      const result = await claimDailyReward(user.id)
      
      if (!result.success) {
        toast({
          title: "領取失敗",
          description: result.message || "您已經領取過今天的獎勵",
        })
        return
      }
      
      const newStreak = { ...loginStreak }
      const dayIndex = result.current_day
      
      // Mark current day as completed
      if (dayIndex >= 0 && dayIndex < newStreak.days.length) {
        const daysCompleted = Array.isArray(result.days_completed) 
          ? result.days_completed.map(day => parseInt(day))
          : []
          
        newStreak.days = newStreak.days.map((day, index) => ({
          ...day,
          completed: daysCompleted.includes(index)
        }))
        
        newStreak.currentDay = result.current_day
        newStreak.lastClaimed = new Date().toISOString()
      }
      
      // Update UI
      setLoginStreak(newStreak)
      setTodaysClaimed(true)
      
      // Refresh the user's profile to get updated balances
      await refreshProfile()
      
      // Show success message
      toast({
        title: "獎勵已領取!",
        description: `您獲得了 +${result.reward_amount} $${result.reward_token}`,
      })
      
      // Refresh transactions list
      await loadTransactions()
      
      return { success: true, data: result }
    } catch (error) {
      console.error('Error claiming daily reward:', error)
      
      toast({
        title: "領取失敗",
        description: "無法領取每日獎勵，請稍後再試",
        variant: "destructive"
      })
      
      return { success: false, error }
    } finally {
      setIsLoading(false)
    }
  }
  
  // Initialize data on component mount
  useEffect(() => {
    if (user) {
      loadLoginStreak()
      loadTransactions()
    }
  }, [user])
  
  return {
    transactions,
    loginStreak,
    todaysClaimed,
    isLoading,
    claimDaily,
    refreshTransactions: loadTransactions,
    refreshLoginStreak: loadLoginStreak
  }
}