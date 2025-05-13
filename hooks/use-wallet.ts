"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/auth-context'
import { supabase } from '@/lib/supabase'

export interface TokenBalances {
  kaia: number
  zoo: number
  wbtc: number
}

export function useWallet() {
  const { user, profile } = useAuth()
  const [balances, setBalances] = useState<TokenBalances>({ kaia: 0, zoo: 0, wbtc: 0 })
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  
  // Initialize from profile
  useEffect(() => {
    if (profile) {
      setBalances({
        kaia: profile.total_kaia || 0,
        zoo: profile.total_zoo || 0,
        wbtc: profile.total_wbtc || 0
      })
      
      setIsWalletConnected(true)
    } else {
      setIsWalletConnected(false)
    }
  }, [profile])
  
  // Connect wallet (this is simplified as it's tied to auth in this app)
  const connectWallet = async () => {
    if (!user) return { success: false, error: 'User not authenticated' }
    
    setIsConnecting(true)
    
    try {
      // In a real app, this would do more to connect to an actual wallet
      // For our demo, we'll just simulate the connection by updating the profile

      // Get the latest profile from the database
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      if (error) throw error
      
      setBalances({
        kaia: data.total_kaia || 0,
        zoo: data.total_zoo || 0,
        wbtc: data.total_wbtc || 0
      })
      
      setIsWalletConnected(true)
      
      return { success: true, data }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      return { success: false, error }
    } finally {
      setIsConnecting(false)
    }
  }
  
  // Refresh balances from the database
  const refreshBalances = async () => {
    if (!user) return { success: false, error: 'User not authenticated' }
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('total_kaia, total_zoo, total_wbtc')
        .eq('user_id', user.id)
        .single()
      
      if (error) throw error
      
      setBalances({
        kaia: data.total_kaia || 0,
        zoo: data.total_zoo || 0,
        wbtc: data.total_wbtc || 0
      })
      
      return { success: true, data: balances }
    } catch (error) {
      console.error('Error refreshing balances:', error)
      return { success: false, error }
    }
  }
  
  return {
    balances,
    isWalletConnected,
    isConnecting,
    connectWallet,
    refreshBalances
  }
}