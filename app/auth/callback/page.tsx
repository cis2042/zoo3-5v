"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LionLogo } from "@/components/lion-logo"
import { Card } from "@/components/ui/card"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    // The actual callback processing is done by the API route
    // This page is just for showing a loading state and redirecting
    
    // Check for error in URL
    const url = new URL(window.location.href)
    const errorParam = url.searchParams.get('error')
    
    if (errorParam) {
      setError(decodeURIComponent(errorParam))
    } else {
      // If no error, redirect to home after a short delay
      const timer = setTimeout(() => {
        router.push('/')
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [router])
  
  return (
    <div className="flex flex-col min-h-screen bg-lion-face-light justify-center items-center p-4">
      <Card className="w-full max-w-md p-8 text-center border-2 border-lion-orange/20 shadow-lion">
        <div className="flex flex-col items-center mb-4">
          <LionLogo size="lg" />
          <h1 className="text-2xl font-bold text-lion-accent mt-4">ZOO3</h1>
        </div>
        
        {error ? (
          <div className="mt-4">
            <p className="text-red-500 font-medium">登入失敗</p>
            <p className="text-gray-600 mt-2">{error}</p>
            <button
              className="mt-4 text-lion-orange underline"
              onClick={() => router.push('/login')}
            >
              返回登入頁面
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-lion-accent font-medium">登入成功！</p>
            <p className="text-gray-600 mt-2">正在將您重定向到首頁...</p>
            <div className="mt-4 flex justify-center">
              <div className="w-6 h-6 border-2 border-t-lion-orange rounded-full animate-spin"></div>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}