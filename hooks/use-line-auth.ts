"use client"

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/context/auth-context'
import { initializeLiff, loginWithLine, getUserProfile } from '@/lib/liff'

export function useLineAuth() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const { refreshProfile } = useAuth()
  
  const initializeLiffSDK = async (liffId: string) => {
    try {
      const success = await initializeLiff(liffId)
      setIsInitialized(success)
      return success
    } catch (error) {
      console.error('Failed to initialize LIFF:', error)
      return false
    }
  }
  
  const connectWithLine = async (liffId: string) => {
    if (!isInitialized) {
      await initializeLiffSDK(liffId)
    }
    
    setIsConnecting(true)
    
    try {
      // Handle LINE login logic
      loginWithLine()
      
      // Note: In a real LIFF app, this would redirect to LINE and then back to the app
      // For this demo, we'll simulate successful authorization after a delay
      
      return { success: true }
    } catch (error) {
      console.error('Error connecting with LINE:', error)
      return { success: false, error }
    } finally {
      setIsConnecting(false)
    }
  }
  
  const handleLineCallback = async () => {
    setIsConnecting(true)
    
    try {
      // Get LINE profile
      const profile = await getUserProfile()
      
      if (!profile) {
        throw new Error('Failed to get LINE profile')
      }
      
      // Get LINE ID token
      const idToken = typeof window !== 'undefined' && window.liff ? window.liff.getIDToken() : null
      
      if (!idToken) {
        throw new Error('Failed to get LINE ID token')
      }
      
      // Authenticate with the backend using the ID token
      const response = await fetch('/api/auth/line', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken,
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl
        })
      })
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Authentication failed')
      }
      
      // Refresh the user's profile
      await refreshProfile()
      
      return { success: true, user: data.user }
    } catch (error) {
      console.error('Error in LINE callback:', error)
      return { success: false, error }
    } finally {
      setIsConnecting(false)
    }
  }
  
  return {
    isConnecting,
    isInitialized,
    connectWithLine,
    handleLineCallback,
    initializeLiffSDK
  }
}