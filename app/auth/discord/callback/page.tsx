"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { exchangeCodeForToken, getDiscordUser, checkGuildMembership } from "@/lib/discord-auth"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LionLogo } from "@/components/lion-logo"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

export default function DiscordCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code")
      const error = searchParams.get("error")

      if (error) {
        setStatus("error")
        setMessage("授權失敗，請重試")
        return
      }

      if (!code) {
        setStatus("error")
        setMessage("無效的授權碼")
        return
      }

      try {
        // Exchange code for access token
        const accessToken = await exchangeCodeForToken(code)

        // Get user information
        const user = await getDiscordUser(accessToken)

        // Check guild membership
        const isMember = await checkGuildMembership(accessToken)

        if (isMember) {
          // Store token and user info
          localStorage.setItem(`discord_token_${user.id}`, accessToken)
          localStorage.setItem("discord_verified", "true")

          setStatus("success")
          setMessage("成功加入 Discord 社區！")

          // Redirect to tasks page after 2 seconds
          setTimeout(() => {
            router.push("/tasks?discord_verified=true")
          }, 2000)
        } else {
          setStatus("error")
          setMessage("請先加入 Discord 社區")
        }
      } catch (error) {
        console.error("Discord callback error:", error)
        setStatus("error")
        setMessage("驗證過程出現錯誤，請重試")
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="flex flex-col min-h-screen bg-lion-face-light items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <LionLogo size="lg" />
        </div>

        {status === "loading" && (
          <>
            <Loader2 className="h-16 w-16 animate-spin text-lion-orange mx-auto" />
            <h2 className="text-xl font-bold text-lion-accent">正在驗證...</h2>
            <p className="text-gray-600">請稍候，我們正在確認您的 Discord 身份</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
            <h2 className="text-xl font-bold text-green-600">{message}</h2>
            <p className="text-gray-600">您已獲得 +5 $ZOO 獎勵</p>
            <p className="text-sm text-gray-500">正在返回任務頁面...</p>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-16 w-16 text-red-500 mx-auto" />
            <h2 className="text-xl font-bold text-red-600">{message}</h2>
            <Button variant="orange" onClick={() => router.push("/tasks")} className="w-full">
              返回任務頁面
            </Button>
          </>
        )}
      </Card>
    </div>
  )
}
