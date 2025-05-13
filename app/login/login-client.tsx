"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LionLogo } from "@/components/lion-logo"
import { useAuth } from "@/context/auth-context"
import { useLineAuth } from "@/hooks/use-line-auth"
import { toast } from "@/components/ui/use-toast"

const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID || ""

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const referralCode = searchParams.get('ref')
  const { signIn, signUp } = useAuth()
  const { connectWithLine } = useLineAuth()
  
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  
  // Login form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  
  const handleSignIn = async () => {
    if (!email || !password) {
      setAuthError("請輸入電子郵件和密碼")
      return
    }
    
    setIsLoading(true)
    setAuthError(null)
    
    try {
      const result = await signIn(email, password)
      
      if (result.success) {
        toast({
          title: "登入成功",
          description: "歡迎回到 ZOO3！",
        })
        router.push('/')
      } else {
        setAuthError(result.error?.message || "登入失敗，請檢查您的憑證")
      }
    } catch (error) {
      console.error("Login error:", error)
      setAuthError("登入時發生錯誤")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleSignUp = async () => {
    if (!email || !password) {
      setAuthError("請輸入電子郵件和密碼")
      return
    }
    
    setIsLoading(true)
    setAuthError(null)
    
    try {
      const result = await signUp(email, password, displayName)
      
      if (result.success) {
        toast({
          title: "註冊成功",
          description: "您的帳戶已建立，請檢查您的電子郵件進行驗證",
        })
        
        // If there's a referral code, process it
        if (referralCode) {
          try {
            const response = await fetch('/api/referrals', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ referralCode }),
            })
            
            const data = await response.json()
            
            if (data.success) {
              toast({
                title: "推薦成功",
                description: `您已成功使用推薦碼 ${referralCode}`,
              })
            }
          } catch (error) {
            console.error("Referral processing error:", error)
          }
        }
        
        router.push('/')
      } else {
        setAuthError(result.error?.message || "註冊失敗，請稍後再試")
      }
    } catch (error) {
      console.error("Signup error:", error)
      setAuthError("註冊時發生錯誤")
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleLineLogin = async () => {
    setIsLoading(true)
    setAuthError(null)
    
    try {
      await connectWithLine(LIFF_ID)
      // Note: The actual redirect will happen in the LINE app
    } catch (error) {
      console.error("LINE login error:", error)
      setAuthError("使用 LINE 登入時發生錯誤")
      setIsLoading(false)
    }
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-lion-face-light justify-center items-center p-4">
      <div className="mb-6 text-center">
        <div className="flex flex-col items-center mb-4">
          <LionLogo size="lg" />
          <h1 className="text-3xl font-bold text-lion-accent mt-4">ZOO3</h1>
          <p className="text-gray-600 mt-1">區塊鏈獎勵任務平台</p>
        </div>
      </div>
      
      <Card className="w-full max-w-md border-2 border-lion-orange/20 shadow-lion">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-lion-accent">歡迎回來</CardTitle>
          <CardDescription className="text-center">
            使用您的帳號登入或註冊一個新帳號
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {authError && (
            <Alert variant="destructive">
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">登入</TabsTrigger>
              <TabsTrigger value="register">註冊</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4">
              <div className="space-y-2">
                <Input 
                  type="email" 
                  placeholder="電子郵件" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
                <Input 
                  type="password" 
                  placeholder="密碼" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
              </div>
              
              <Button 
                className="w-full" 
                variant="orange"
                onClick={handleSignIn}
                disabled={isLoading}
              >
                {isLoading ? "登入中..." : "登入"}
              </Button>
            </TabsContent>
            
            <TabsContent value="register" className="space-y-4">
              <div className="space-y-2">
                <Input 
                  type="text" 
                  placeholder="顯示名稱" 
                  value={displayName} 
                  onChange={(e) => setDisplayName(e.target.value)} 
                />
                <Input 
                  type="email" 
                  placeholder="電子郵件" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                />
                <Input 
                  type="password" 
                  placeholder="密碼" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                />
                
                {referralCode && (
                  <div className="flex items-center p-2 bg-lion-face rounded-md">
                    <span className="text-sm text-gray-600">推薦碼：</span>
                    <span className="ml-2 font-medium text-lion-orange">{referralCode}</span>
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full" 
                variant="teal"
                onClick={handleSignUp}
                disabled={isLoading}
              >
                {isLoading ? "註冊中..." : "註冊新帳號"}
              </Button>
            </TabsContent>
          </Tabs>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">或</span>
            </div>
          </div>
          
          <Button
            variant="outline"
            className="w-full bg-[#06C755] hover:bg-[#05A847] text-white"
            onClick={handleLineLogin}
            disabled={isLoading}
          >
            <Image 
              src="/images/line-wallet-icon.png"
              alt="LINE"
              width={20}
              height={20}
              className="mr-2"
            />
            使用 LINE 帳號登入
          </Button>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-xs text-center text-gray-500">
            繼續即表示您同意我們的
            <Link href="/terms" className="underline text-lion-orange ml-1">
              服務條款
            </Link>
            和
            <Link href="/privacy" className="underline text-lion-orange ml-1">
              隱私政策
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}