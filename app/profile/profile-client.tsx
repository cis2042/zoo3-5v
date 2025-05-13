"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Trophy, RefreshCw, Users, Star } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { LionLogo } from "@/components/lion-logo"
import { useAuth } from "@/context/auth-context"
import { useWallet } from "@/hooks/use-wallet"

interface Achievement {
  id: string
  achievement_type: string
  achievement_level: number
  current_progress: number
  next_target: number
}

export default function ProfilePage() {
  const { user, profile } = useAuth()
  const { balances } = useWallet()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Load achievements
  useEffect(() => {
    const loadAchievements = async () => {
      if (!user) return
      
      setIsLoading(true)
      
      try {
        const response = await fetch('/api/user/profile')
        const data = await response.json()
        
        if (data.success) {
          setAchievements(data.data.achievements || [])
        }
      } catch (error) {
        console.error('Error loading achievements:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    if (user) {
      loadAchievements()
    } else {
      setIsLoading(false)
    }
  }, [user])
  
  // Calculate the login streak level
  const loginStreakLevel = profile?.login_streak 
    ? profile.login_streak >= 180 ? 7
      : profile.login_streak >= 90 ? 6
      : profile.login_streak >= 60 ? 5
      : profile.login_streak >= 30 ? 4
      : profile.login_streak >= 14 ? 3
      : profile.login_streak >= 7 ? 2
      : profile.login_streak >= 3 ? 1 : 0
    : 0
  
  // Calculate referral level
  const referralCount = profile?.referral_count || 0
  const referralLevel = referralCount >= 200 ? 7
    : referralCount >= 150 ? 6
    : referralCount >= 100 ? 5
    : referralCount >= 75 ? 4
    : referralCount >= 50 ? 3
    : referralCount >= 25 ? 2
    : referralCount >= 10 ? 1 : 0

  return (
    <div className="flex flex-col min-h-screen bg-lion-face-light pb-16">
      <header className="bg-gradient-to-r from-lion-orange to-lion-red text-white p-4 text-center shadow-md">
        <div className="flex items-center justify-center gap-2">
          <LionLogo size="sm" />
          <h1 className="text-2xl font-bold">成就</h1>
        </div>
      </header>

      <main className="flex-1 container max-w-md mx-auto p-4 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <StatsCard title="總收入" value={`$${(balances.kaia * 0.5 + balances.zoo * 0.8 + balances.wbtc * 20000).toFixed(2)}`} />
          <StatsCard title="已完成任務" value={profile?.total_tasks_completed?.toString() || "0"} />
          <StatsCard title="當前連續簽到" value={`${profile?.login_streak || 0} 天`} />
        </div>

        {/* Achievements */}
        <Card className="p-5 rounded-xl bg-white border-2 border-lion-teal/20 shadow-lion-teal">
          <h2 className="text-xl font-bold mb-4 text-lion-accent flex items-center">
            <Trophy className="h-5 w-5 text-lion-orange mr-2" />
            成就
          </h2>

          <div className="space-y-5">
            <Achievement
              icon={<Trophy className="h-6 w-6 text-white" />}
              title="早期採用者"
              description="在發布月份加入"
              status={
                <span className="bg-lion-orange/20 text-lion-orange text-xs font-medium px-3 py-1 rounded-full">
                  已解鎖
                </span>
              }
            />

            <MultiLevelAchievement
              icon={<RefreshCw className="h-6 w-6 text-white" />}
              title="連續簽到大師"
              description="連續簽到天數"
              currentValue={profile?.login_streak || 0}
              levels={[
                { target: 3, reward: "初級簽到", achieved: loginStreakLevel >= 1 },
                { target: 7, reward: "週簽達人", achieved: loginStreakLevel >= 2 },
                { target: 14, reward: "雙週勇士", achieved: loginStreakLevel >= 3 },
                { target: 30, reward: "月度冠軍", achieved: loginStreakLevel >= 4 },
                { target: 60, reward: "季度之星", achieved: loginStreakLevel >= 5 },
                { target: 90, reward: "季度大師", achieved: loginStreakLevel >= 6 },
                { target: 180, reward: "半年傳說", achieved: loginStreakLevel >= 7 },
              ]}
              unit="天"
              colorClass="orange"
            />

            <MultiLevelAchievement
              icon={<Users className="h-6 w-6 text-white" />}
              title="推薦大師"
              description="推薦更多的朋友參與"
              currentValue={referralCount}
              levels={[
                { target: 10, reward: "一星推薦", achieved: referralLevel >= 1 },
                { target: 25, reward: "二星推薦", achieved: referralLevel >= 2 },
                { target: 50, reward: "三星推薦", achieved: referralLevel >= 3 },
                { target: 75, reward: "四星推薦", achieved: referralLevel >= 4 },
                { target: 100, reward: "五星推薦", achieved: referralLevel >= 5 },
                { target: 150, reward: "專業推薦", achieved: referralLevel >= 6 },
                { target: 200, reward: "頂級推薦", achieved: referralLevel >= 7 },
              ]}
              unit="人"
              colorClass="teal"
            />
          </div>
        </Card>
      </main>

      <BottomNavigation activeTab="profile" />
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: string
}

function StatsCard({ title, value }: StatsCardProps) {
  return (
    <Card className="p-4 rounded-xl bg-white border-2 border-lion-orange/20 shadow-lion">
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className="text-xl font-bold text-lion-accent">{value}</p>
      </div>
    </Card>
  )
}

interface AchievementProps {
  icon: React.ReactNode
  title: string
  description: string
  status: React.ReactNode
}

function Achievement({ icon, title, description, status }: AchievementProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="bg-gradient-to-br from-lion-orange to-lion-red p-3 rounded-full shadow-sm">{icon}</div>
        <div>
          <h3 className="font-bold text-lion-accent">{title}</h3>
          <p className="text-gray-500 text-sm">{description}</p>
        </div>
      </div>
      {status}
    </div>
  )
}

interface Level {
  target: number
  reward: string
  achieved: boolean
}

interface MultiLevelAchievementProps {
  icon: React.ReactNode
  title: string
  description: string
  currentValue: number
  levels: Level[]
  unit?: string
  colorClass?: "orange" | "teal" | "green" | "yellow"
}

function MultiLevelAchievement({
  icon,
  title,
  description,
  currentValue,
  levels,
  unit = "",
  colorClass = "orange",
}: MultiLevelAchievementProps) {
  // Find the current level and next level
  const currentLevelIndex = levels.findIndex((level) => !level.achieved)
  const currentLevel = currentLevelIndex > 0 ? levels[currentLevelIndex - 1] : null
  const nextLevel = currentLevelIndex >= 0 ? levels[currentLevelIndex] : levels[levels.length - 1]

  // Calculate progress percentage
  const prevTarget = currentLevelIndex > 0 ? levels[currentLevelIndex - 1].target : 0
  const progressValue = nextLevel
    ? Math.min(((currentValue - prevTarget) / (nextLevel.target - prevTarget)) * 100, 100)
    : 100

  // Color classes based on the colorClass prop
  const colorClasses = {
    orange: {
      bg: "bg-lion-orange/20",
      text: "text-lion-orange",
      fill: "text-lion-orange fill-lion-orange",
      progress: "bg-gradient-to-r from-lion-orange to-lion-red",
      light: "bg-lion-orange/30 text-lion-orange",
      medium: "bg-gradient-to-r from-lion-orange to-lion-red text-white",
    },
    teal: {
      bg: "bg-lion-teal/20",
      text: "text-lion-teal",
      fill: "text-lion-teal fill-lion-teal",
      progress: "bg-gradient-to-r from-lion-teal to-lion-teal-dark",
      light: "bg-lion-teal/30 text-lion-teal",
      medium: "bg-gradient-to-r from-lion-teal to-lion-teal-dark text-white",
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-800",
      fill: "text-green-500 fill-green-500",
      progress: "bg-green-500",
      light: "bg-green-200 text-green-800",
      medium: "bg-green-500 text-white",
    },
    yellow: {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      fill: "text-yellow-500 fill-yellow-500",
      progress: "bg-yellow-500",
      light: "bg-yellow-200 text-yellow-800",
      medium: "bg-yellow-500 text-white",
    },
  }

  const colors = colorClasses[colorClass]

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`${colorClass === "orange" ? "bg-gradient-to-br from-lion-orange to-lion-red" : "bg-gradient-to-br from-lion-teal to-lion-teal-dark"} p-3 rounded-full shadow-sm`}
          >
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-lion-accent">{title}</h3>
            <p className="text-gray-500 text-sm">{description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-4 w-4 ${i < Math.min(currentLevelIndex, 5) ? colors.fill : "text-gray-300"}`} />
          ))}
        </div>
      </div>

      <div className="bg-lion-face-light rounded-lg p-3 border border-lion-face">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            目前: {currentValue} {unit}
          </span>
          <span className={`text-xs ${colors.bg} ${colors.text} px-2 py-0.5 rounded-full`}>
            {currentLevel ? currentLevel.reward : "尚未達成"}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{prevTarget}</span>
            <span>
              {nextLevel ? nextLevel.target : levels[levels.length - 1].target}
              {unit}
            </span>
          </div>
          <Progress value={progressValue} className={`h-2 ${colors.progress} rounded-full`} />
        </div>

        <div className="mt-3 text-sm">
          <span className="text-gray-600">下一等級: </span>
          <span className={`font-medium ${colors.text}`}>{nextLevel ? nextLevel.reward : "已達最高等級"}</span>
          {nextLevel && (
            <span className="text-gray-600">
              {" "}
              (還需 {nextLevel.target - currentValue} {unit})
            </span>
          )}
        </div>
      </div>

      <div className="pb-2">
        <div className="grid grid-cols-7 gap-2">
          {levels.map((level, index) => (
            <div key={index} className="text-center">
              <div
                className={`mx-auto w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  level.achieved
                    ? colors.medium
                    : index === currentLevelIndex
                      ? `${colors.light} animate-pulse-subtle`
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {index + 1}
              </div>
              <p className="text-xs mt-1">{level.target}{unit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}