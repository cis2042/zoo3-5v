"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { initializeLiff, getUserProfile } from "@/lib/liff"

// Define the shape of the context
interface LiffContextType {
  isInitialized: boolean
  isLoggedIn: boolean
  isInClient: boolean
  profile: any | null
  error: Error | null
  loading: boolean
}

// Create the context with default values
const LiffContext = createContext<LiffContextType>({
  isInitialized: false,
  isLoggedIn: false,
  isInClient: false,
  profile: null,
  error: null,
  loading: true,
})

// Hook to use the LIFF context
export const useLiff = () => useContext(LiffContext)

// Provider component
interface LiffProviderProps {
  children: ReactNode
  liffId: string
}

export function LiffProvider({ children, liffId }: LiffProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isInClient, setIsInClient] = useState(false)
  const [profile, setProfile] = useState<any | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initialize = async () => {
      try {
        setLoading(true)

        // Initialize LIFF
        const initialized = await initializeLiff(liffId)
        setIsInitialized(initialized)

        if (initialized && typeof window !== "undefined" && window.liff) {
          // Check if user is logged in
          const loggedIn = window.liff.isLoggedIn()
          setIsLoggedIn(loggedIn)

          // Check if running in LINE app
          setIsInClient(window.liff.isInClient())

          // Get user profile if logged in
          if (loggedIn) {
            const userProfile = await getUserProfile()
            setProfile(userProfile)
          }
        }
      } catch (err) {
        console.error("Error initializing LIFF:", err)
        setError(err instanceof Error ? err : new Error(String(err)))
      } finally {
        setLoading(false)
      }
    }

    initialize()
  }, [liffId])

  const value = {
    isInitialized,
    isLoggedIn,
    isInClient,
    profile,
    error,
    loading,
  }

  return <LiffContext.Provider value={value}>{children}</LiffContext.Provider>
}
