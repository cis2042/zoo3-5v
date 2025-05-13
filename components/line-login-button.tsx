"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { initializeLiff, loginWithLine } from "@/lib/liff"
import Image from "next/image"

interface LineLoginButtonProps {
  liffId: string
  onSuccess?: () => void
  onError?: (error: Error) => void
  className?: string
  children?: React.ReactNode
}

export function LineLoginButton({
  liffId,
  onSuccess,
  onError,
  className,
  children = "Connect LINE Wallet",
}: LineLoginButtonProps) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const initialize = async () => {
      try {
        setIsLoading(true)
        const success = await initializeLiff(liffId)
        setIsInitialized(success)
        if (success && onSuccess) {
          onSuccess()
        }
      } catch (error) {
        console.error("Failed to initialize LIFF:", error)
        if (onError && error instanceof Error) {
          onError(error)
        }
      } finally {
        setIsLoading(false)
      }
    }

    initialize()
  }, [liffId, onSuccess, onError])

  const handleLogin = () => {
    if (!isInitialized) {
      console.error("LIFF is not initialized")
      return
    }

    try {
      setIsLoading(true)
      loginWithLine()
    } catch (error) {
      console.error("Failed to login with LINE:", error)
      if (onError && error instanceof Error) {
        onError(error)
      }
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleLogin}
      disabled={isLoading || !isInitialized}
      className={`bg-[#06C755] hover:bg-[#05A847] text-white flex items-center gap-2 ${className}`}
    >
      <Image src="/images/line-wallet-icon.png" alt="LINE Wallet" width={24} height={24} className="object-contain" />
      {isLoading ? "Connecting..." : children}
    </Button>
  )
}
