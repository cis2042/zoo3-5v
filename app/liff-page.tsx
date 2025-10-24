"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Gift, Copy, Users } from "lucide-react"
import { useLiff } from "./liff-provider"
import { toast } from "@/components/ui/use-toast"
import { LineConnectButton } from "@/components/line-connect-button"

// Replace with your actual LIFF ID
const LIFF_ID = "YOUR_LIFF_ID"

export default function LiffPage() {
  const { isLoggedIn, profile, loading } = useLiff()
  const [referralLink, setReferralLink] = useState("")
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState(false)

  useEffect(() => {
    // Generate a random referral link for demo purposes
    if (profile) {
      const randomRef = Math.random().toString(36).substring(2, 8)
      setReferralLink(`https://bitbee.app/register?ref=${randomRef}`)
    }
  }, [profile])

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    toast({
      title: "Link copied!",
      description: "Referral link copied to clipboard",
    })
  }

  const claimDailyReward = () => {
    setDailyRewardClaimed(true)
    toast({
      title: "Reward claimed!",
      description: "You've received +1 $KAIA",
    })
  }

  const handleLogin = () => {
    // This would normally call loginWithLine() from lib/liff.ts
    console.log("Connecting to LINE wallet...")
  }

  return (
    <div className="flex flex-col min-h-screen bg-lion-face-light">
      {/* Header */}
      <header className="bg-gradient-to-r from-lion-orange to-lion-red text-white p-4 text-center shadow-md">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl">🐾</span>
          <h1 className="text-2xl font-bold">ZOO3</h1>
        </div>
        <p className="mt-1 text-sm">完成任務獲取獎勵</p>
      </header>

      <main className="flex-1 container max-w-md mx-auto p-4 space-y-4">
        {/* LINE Wallet Connection Card */}
        <Card className="p-6 rounded-xl border-2 border-lion-orange/20 shadow-lion">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 flex items-center justify-center">
              <Image
                src="/images/line-wallet-icon.png"
                alt="LINE Wallet"
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
            <div className="text-center">
              <h2 className="text-lg font-semibold flex items-center justify-center gap-1 text-lion-accent">
                <span className="text-sm">🐾</span> 連接 LINE 錢包
              </h2>
              <p className="text-sm text-gray-600 mt-1">連接您的 LINE 錢包以查看您的代幣並參與任務</p>
            </div>

            {isLoggedIn ? (
              <div className="w-full text-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-green-600 font-medium">已連接</p>
                <p className="text-sm text-gray-600 mt-1">
                  {profile?.displayName ? `歡迎, ${profile.displayName}` : "LINE 錢包已成功連接"}
                </p>
              </div>
            ) : (
              <LineConnectButton onClick={handleLogin} isLoading={loading} isConnected={isLoggedIn} />
            )}
          </div>
        </Card>

        {/* Daily Login Challenge Card */}
        <Card className="p-6 rounded-xl border-2 border-lion-teal/20 shadow-lion-teal">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-center flex items-center justify-center gap-1 text-lion-accent">
              <span className="text-sm">🐾</span> 每日連續登入挑戰
            </h2>

            {/* Today's Reward */}
            <div className="bg-lion-face border border-lion-face-dark rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-2">
                <Gift className="h-5 w-5 text-lion-orange" />
                <span className="font-medium">今日獎勵: +1 $KAIA</span>
              </div>
            </div>

            {/* Day Progress */}
            <div className="grid grid-cols-7 gap-2 mt-4">
              {[
                { day: 1, reward: "+1", active: true },
                { day: 2, reward: "+1", active: true },
                { day: 3, reward: "+2", active: false },
                { day: 4, reward: "+2", active: false },
                { day: 5, reward: "+3", active: false },
                { day: 6, reward: "+3", active: false },
                { day: 7, reward: "+10 🎁", active: false, special: true },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${
                      item.active
                        ? "bg-gradient-to-br from-lion-orange to-lion-red"
                        : item.special
                          ? "bg-gradient-to-br from-lion-teal to-lion-teal-dark"
                          : "bg-gradient-to-br from-lion-orange-light to-lion-red-light opacity-70"
                    }`}
                  >
                    {item.day}
                  </div>
                  <span className={`text-xs mt-1 ${item.special ? "text-lion-teal font-medium" : ""}`}>
                    {item.reward}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-lion-orange">開始您的獎勵之旅！</p>

            <Button
              className="w-full bg-gradient-to-r from-lion-orange to-lion-red hover:from-lion-orange-dark hover:to-lion-red-dark text-white"
              onClick={claimDailyReward}
              disabled={dailyRewardClaimed || !isLoggedIn}
            >
              {dailyRewardClaimed ? "已領取" : "點擊領取今日獎勵"}
            </Button>
          </div>
        </Card>

        {/* Referral Program Card */}
        <Card className="p-6 rounded-xl border-2 border-lion-orange/20 shadow-lion">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-lion-orange to-lion-red p-3 rounded-full shadow-md">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lion-accent">推薦計劃</h2>
                <div className="flex items-center text-sm">
                  <p className="text-gray-600">邀請朋友加入 ZOO3，雙方都能獲得獎勵！</p>
                  <div className="flex items-center ml-1 text-lion-orange font-medium">
                    <Gift className="h-4 w-4 mr-1" />
                    <span>0 $ZOO</span>
                  </div>
                </div>
              </div>
            </div>

            <Progress value={0} className="h-2" />
            <p className="text-xs text-gray-500 text-center">0/5 位好友</p>

            <p className="text-sm text-gray-600 text-center">
              邀請朋友加入 ZOO3，當他們使用您的推薦連結註冊時，您們雙方都將獲得 10 $ZOO 獎勵！
            </p>

            <div className="flex gap-2">
              <Input value={referralLink || "請先連接 LINE 錢包"} readOnly className="text-xs" disabled={!isLoggedIn} />
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 border-lion-orange text-lion-orange hover:bg-lion-orange/10 bg-transparent"
                onClick={copyReferralLink}
                disabled={!isLoggedIn}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-lion-orange to-lion-red hover:from-lion-orange-dark hover:to-lion-red-dark text-white"
              onClick={copyReferralLink}
              disabled={!isLoggedIn}
            >
              複製邀請連結
            </Button>
          </div>
        </Card>
      </main>
    </div>
  )
}
