"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { getUserProfile } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: any | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: any }>
  signUp: (email: string, password: string, displayName?: string) => Promise<{ success: boolean; error?: any }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Initial session check
    const initializeAuth = async () => {
      setIsLoading(true)
      
      try {
        // Get session
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
        
        // Get profile if user exists
        if (session?.user) {
          const profile = await getUserProfile(session.user.id)
          setProfile(profile)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    initializeAuth()
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        // Get profile on auth changes
        if (session?.user) {
          const profile = await getUserProfile(session.user.id)
          setProfile(profile)
        } else {
          setProfile(null)
        }
      }
    )
    
    // Cleanup subscription
    return () => {
      subscription.unsubscribe()
    }
  }, [])
  
  const refreshProfile = async () => {
    if (!user) return
    
    try {
      const profile = await getUserProfile(user.id)
      setProfile(profile)
    } catch (error) {
      console.error('Error refreshing profile:', error)
    }
  }
  
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) throw error
      
      return { success: true }
    } catch (error) {
      console.error('Error signing in:', error)
      return { success: false, error }
    }
  }
  
  const signUp = async (email: string, password: string, displayName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName || email.split('@')[0]
          }
        }
      })
      
      if (error) throw error
      
      return { success: true }
    } catch (error) {
      console.error('Error signing up:', error)
      return { success: false, error }
    }
  }
  
  const signOut = async () => {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }
  
  const value = {
    user,
    session,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshProfile
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}