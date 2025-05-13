"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Gift, Copy, Users, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { BottomNavigation } from "@/components/bottom-navigation"
import { LionLogo } from "@/components/lion-logo"
import { LineConnectButton } from "@/components/line-connect-button"
import { useAuth } from "@/context/auth-context"
import { useWallet } from "@/hooks/use-wallet"
import { useRewards } from "@/hooks/use-rewards"
import { AuthProvider } from "@/context/auth-context"

export default function Home() {
  const { user, profile } = useAuth()
  const { balances, isWalletConnected, isConnecting, connectWallet } = useWallet()
  const { loginStreak, todaysClaimed, isLoading, claimDaily } = useRewards()
  const [linkCopied, setLinkCopied] = useState(false)

  // Function to copy referral link
  const copyReferralLink = () => {
    // Get referral code from profile
    const referralCode = profile?.referral_code || "Kkwf5b"
    const referralLink = `https://zoo3.app/register?ref=${referralCode}`
    
    navigator.clipboard.writeText(referralLink)
    setLinkCopied(true)

    toast({
      title: "連結已複製!",
      description: "邀請連結已複製到剪貼簿",
    })

    // Reset the button state after 3 seconds
    setTimeout(() => {
      setLinkCopied(false)
    }, 3000)
  }

  // Function to handle daily reward claim
  const handleClaimDailyReward = async () => {
    if (todaysClaimed || !isWalletConnected) return
    
    await claimDaily()
  }

  // Function to handle wallet connection
  const handleConnectWallet = async () => {
    if (isWalletConnected) return
    
    const result = await connectWallet()
    
    if (result.success) {
      toast({
        title: "錢包已連接!",
        description: "您的 LINE 錢包已成功連接",
      })
    } else {
      toast({
        title: "連接失敗",
        description: "無法連接到您的 LINE 錢包，請稍後再試",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-lion-face-light pb-16">
      {/* Header */}
      <header className="bg-gradient-to-r from-lion-orange to-lion-red text-white p-4 text-center shadow-md">
        <div className="flex items-center justify-center gap-2">
          <LionLogo size="sm" />
          <h1 className="text-2xl font-bold">ZOO3</h1>
        </div>
        <p className="mt-1 text-sm">完成任務獲取獎勵</p>
      </header>

      <main className="flex-1 container max-w-md mx-auto p-4 space-y-4">
        {/* LINE Wallet Connection Card */}
        <Card className="p-6 rounded-xl bg-white border-2 border-lion-orange/20 shadow-lion overflow-hidden">
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
              <h2 className="text-lg font-bold flex items-center justify-center gap-1 text-lion-accent">
                <span className="text-sm">🐾</span> 連接 LINE 錢包
              </h2>
              <p className="text-sm text-gray-600 mt-1">連接您的 LINE 錢包以查看您的代幣並參與任務</p>
            </div>

            {isWalletConnected ? (
              <div className="w-full text-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                <p className="text-green-600 font-medium">已連接</p>
                <p className="text-sm text-gray-600 mt-1">
                  {profile?.display_name ? `歡迎, ${profile.display_name}` : 'LINE 錢包已成功連接'}
                </p>
              </div>
            ) : (
              <LineConnectButton 
                onClick={handleConnectWallet} 
                isLoading={isConnecting} 
                isConnected={isWalletConnected} 
              />
            )}
          </div>
        </Card>

        {/* Daily Login Challenge Card */}
        <Card className="p-6 rounded-xl bg-white border-2 border-lion-teal/20 shadow-lion-teal overflow-hidden">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-center flex items-center justify-center gap-1 text-lion-accent">
              <span className="text-sm">🐾</span> 每日連續登入挑戰
            </h2>

            {/* Today's Reward */}
            <div className="bg-lion-face rounded-lg p-3 text-center border border-lion-face-dark">
              <div className="flex items-center justify-center gap-2">
                <Gift className="h-5 w-5 text-lion-orange" />
                <span className="font-medium">今日獎勵: +1 $KAIA</span>
              </div>
            </div>

            {/* Day Progress */}
            <div className="grid grid-cols-7 gap-2 mt-4">
              {loginStreak.days.map((day, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium shadow-sm
                      ${
                        day.completed
                          ? "bg-gradient-to-br from-lion-orange to-lion-red"
                          : index === loginStreak.currentDay && !day.completed
                            ? "bg-gradient-to-br from-lion-orange to-lion-red animate-pulse-subtle"
                            : index === 6
                              ? "bg-gradient-to-br from-lion-teal to-lion-teal-dark"
                              : "bg-gradient-to-br from-lion-orange-light to-lion-red-light opacity-70"
                      }`}
                  >
                    {index + 1}
                  </div>
                  <span className={`text-xs mt-1 ${index === 6 ? "text-lion-teal font-medium" : ""}`}>
                    {day.reward}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-lion-orange">
              {loginStreak.currentDay === 6 && loginStreak.days[6].completed
                ? "恭喜完成連續登入挑戰！"
                : `連續登入: ${loginStreak.currentDay + 1}/7 天`}
            </p>

            <Button
              variant={todaysClaimed ? "teal" : "orange"}
              className="w-full"
              onClick={handleClaimDailyReward}
              disabled={todaysClaimed || !isWalletConnected || isLoading}
            >
              {isLoading 
                ? "載入中..." 
                : todaysClaimed 
                  ? "已領取今日獎勵" 
                  : "點擊領取今日獎勵"}
            </Button>
          </div>
        </Card>

        {/* Referral Program Card */}
        <Card className="p-6 rounded-xl bg-white border-2 border-lion-orange/20 shadow-lion overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-lion-orange to-lion-red p-3 rounded-full shadow-md">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-lion-accent">ZOO3 推薦計劃</h2>
                <div className="flex items-center text-sm">
                  <p className="text-gray-600">邀請朋友加入 ZOO3，雙方都能獲得獎勵！</p>
                </div>
              </div>
            </div>

            <div className="bg-lion-face rounded-lg p-3 flex justify-between items-center border border-lion-face-dark">
              <span className="text-sm font-medium text-gray-700">推薦獎勵</span>
              <div className="flex items-center text-lion-orange font-bold">
                <Gift className="h-5 w-5 mr-1" />
                <span>+10 $ZOO</span>
              </div>
            </div>

            <Progress value={profile?.referral_count || 0} max={200} className="h-2.5 bg-gray-100" />
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <span>已推薦: {profile?.referral_count || 0} 人</span>
            </div>

            <p className="text-sm text-gray-600 bg-lion-teal/10 p-3 rounded-lg border border-lion-teal/20">
              邀請朋友加入 ZOO3，當他們使用您的推薦連結註冊時，您們雙方都將獲得{" "}
              <span className="font-bold text-lion-teal">10 $ZOO</span> 獎勵！
            </p>

            <div className="flex gap-2">
              <Input 
                value={`https://zoo3.app/register?ref=${profile?.referral_code || "Kkwf5b"}`}
                readOnly 
                className="text-xs bg-gray-50 border-gray-200" 
              />
              <Button
                variant="outline"
                size="icon"
                className={`shrink-0 ${
                  linkCopied
                    ? "border-lion-teal bg-lion-teal/10 text-lion-teal"
                    : "border-lion-orange hover:bg-lion-orange/10 hover:border-lion-orange text-lion-orange"
                }`}
                onClick={copyReferralLink}
                disabled={!isWalletConnected}
              >
                {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <Button
              variant={linkCopied ? "teal" : "orange"}
              className="w-full flex items-center justify-center gap-2"
              onClick={copyReferralLink}
              disabled={!isWalletConnected}
            >
              {linkCopied ? (
                <>
                  <Check className="h-5 w-5" />
                  已複製邀請連結
                </>
              ) : (
                <>
                  <Copy className="h-5 w-5" />
                  複製邀請連結
                </>
              )}
            </Button>
          </div>
        </Card>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="home" />
    </div>
  )
}