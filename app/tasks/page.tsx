"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Share2, MessageSquare, ChevronDown, ChevronUp, Check, ExternalLink } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { LionLogo } from "@/components/lion-logo"
import { toast } from "@/components/ui/use-toast"

export default function TasksPage() {
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [referralLink, setReferralLink] = useState("")

  useEffect(() => {
    // Generate referral link - you can customize this logic
    const savedReferralLink = localStorage.getItem("referralLink")
    if (savedReferralLink) {
      setReferralLink(savedReferralLink)
    } else {
      const randomRef = Math.random().toString(36).substring(2, 8)
      const newLink = `https://bitbee.app/register?ref=${randomRef}`
      setReferralLink(newLink)
      localStorage.setItem("referralLink", newLink)
    }
  }, [])

  // Function to mark a task as completed
  const completeTask = (taskId: string, reward: string) => {
    if (!completedTasks.includes(taskId)) {
      setCompletedTasks([...completedTasks, taskId])

      toast({
        title: "任務完成!",
        description: `您獲得了 ${reward}`,
      })
    }
  }

  // Simulate Discord OAuth callback
  const handleDiscordCallback = () => {
    // In a real app, this would be triggered by the OAuth callback
    completeTask("discord", "+5 $ZOO")
  }

  return (
    <div className="flex flex-col min-h-screen bg-lion-face-light pb-16">
      {/* Header */}
      <header className="bg-gradient-to-r from-lion-orange to-lion-red text-white p-4 text-center shadow-md">
        <div className="flex items-center justify-center gap-2">
          <LionLogo size="sm" />
          <h1 className="text-2xl font-bold">任務中心</h1>
        </div>
      </header>

      {/* Tasks List */}
      <div className="flex-1 container max-w-md mx-auto px-4 pt-4 space-y-4 pb-4">
        {/* Task Cards */}
        <div className="space-y-4">
          {/* Discord Task */}
          <TaskCard
            id="discord"
            icon={<MessageSquare className="h-5 w-5 text-white" />}
            title="加入 Discord 社區"
            description="加入 ZOO3 官方 Discord 社區並完成身份驗證"
            reward="+5 $ZOO"
            isCompleted={completedTasks.includes("discord")}
            onComplete={() => completeTask("discord", "+5 $ZOO")}
            onDiscordCallback={handleDiscordCallback}
          />

          {/* Social Media Sharing */}
          <TaskCard
            id="social-share"
            icon={<Share2 className="h-5 w-5 text-white" />}
            title="社交媒體分享"
            description="在您的社群媒體上分享"
            reward="+5 $ZOO"
            isCompleted={completedTasks.includes("social-share")}
            onComplete={() => completeTask("social-share", "+5 $ZOO")}
            referralLink={referralLink}
          />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="tasks" />
    </div>
  )
}

interface TaskCardProps {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  reward: string
  isCompleted?: boolean
  onComplete: () => void
  onDiscordCallback?: () => void
  referralLink?: string
}

function TaskCard({
  id,
  icon,
  title,
  description,
  reward,
  isCompleted = false,
  onComplete,
  onDiscordCallback,
  referralLink = "",
}: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Toggle expanded state
  const toggleExpand = () => {
    if (!isCompleted) {
      setIsExpanded(!isExpanded)
    }
  }

  // Handle Discord join
  const handleDiscordJoin = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card from collapsing when clicking the button

    // In a real app, this would redirect to Discord OAuth
    window.open("https://discord.gg/zoo3", "_blank")

    // Simulate OAuth callback after 2 seconds (in a real app, this would be handled by the OAuth redirect)
    if (id === "discord" && onDiscordCallback) {
      setTimeout(() => {
        onDiscordCallback()
      }, 2000)
    }
  }

  return (
    <div
      className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden
        ${
          isCompleted
            ? "border-green-300 bg-green-50"
            : isExpanded
              ? "border-lion-orange shadow-lion"
              : "border-lion-face-dark shadow-sm hover:shadow-lion"
        }`}
    >
      <div className="flex items-start p-4 cursor-pointer" onClick={toggleExpand}>
        <div
          className={`p-3 rounded-full mr-3 shadow-sm ${
            isCompleted ? "bg-green-500" : "bg-gradient-to-br from-lion-orange to-lion-red"
          }`}
        >
          {isCompleted ? <Check className="h-5 w-5 text-white" /> : icon}
        </div>

        <div className="flex-1">
          <h3 className="font-bold text-lion-accent">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>

        <div className="flex flex-col items-end">
          <div className="bg-lion-face px-3 py-1 rounded-full text-lion-orange font-medium text-sm border border-lion-face-dark mb-1">
            {reward}
          </div>
          {!isCompleted && (
            <div className="text-gray-400">
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          )}
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && !isCompleted && (
        <div className="px-4 pb-4 pt-0">
          <div className="border-t border-gray-100 pt-3">
            {id === "discord" && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  加入我們的 Discord 社區，與其他 ZOO3 用戶交流，獲取最新資訊和獨家福利。
                </p>
                <Button
                  variant="teal"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleDiscordJoin}
                >
                  <ExternalLink className="h-4 w-4" />
                  加入 Discord 社區
                </Button>
              </div>
            )}

            {id === "social-share" && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">在您的社群媒體上分享 BitBee，幫助我們擴大社區，同時獲得獎勵。</p>

                {/* Share message preview */}
                <div className="bg-lion-face-light p-3 rounded-lg border border-lion-face">
                  <p className="text-xs text-gray-500 mb-1">分享文案：</p>
                  <p className="text-sm text-gray-700">
                    🐝 加入 BitBee，完成任務賺取加密貨幣獎勵！ 使用我的推薦連結註冊，我們都能獲得獎勵：
                    {referralLink}
                    #BitBee #加密貨幣 #Web3
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    className="text-black border-gray-300 bg-transparent hover:bg-gray-50"
                    onClick={() => {
                      const shareText = `🐝 加入 BitBee，完成任務賺取加密貨幣獎勵！

使用我的推薦連結註冊，我們都能獲得獎勵：
${referralLink}

#BitBee #加密貨幣 #Web3`
                      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
                      window.open(url, "_blank", "width=550,height=420")

                      // Mark task as complete after sharing
                      setTimeout(() => {
                        onComplete()
                      }, 1000)
                    }}
                  >
                    X (Twitter)
                  </Button>
                  <Button
                    variant="outline"
                    className="text-blue-600 border-blue-200 bg-transparent hover:bg-blue-50"
                    onClick={() => {
                      const shareText = `🐝 加入 BitBee，完成任務賺取加密貨幣獎勵！

使用我的推薦連結註冊，我們都能獲得獎勵：
${referralLink}

#BitBee #加密貨幣 #Web3`
                      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(shareText)}`
                      window.open(url, "_blank", "width=550,height=420")

                      // Mark task as complete after sharing
                      setTimeout(() => {
                        onComplete()
                      }, 1000)
                    }}
                  >
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    className="text-pink-500 border-pink-200 bg-transparent hover:bg-pink-50"
                    onClick={() => {
                      const shareText = `🐝 加入 BitBee，完成任務賺取加密貨幣獎勵！

使用我的推薦連結註冊，我們都能獲得獎勵：
${referralLink}

#BitBee #加密貨幣 #Web3`

                      // Copy to clipboard
                      navigator.clipboard.writeText(shareText).then(() => {
                        toast({
                          title: "已複製!",
                          description: "分享文案已複製到剪貼簿，請前往 Instagram 貼上分享",
                        })

                        // Mark task as complete after copying
                        setTimeout(() => {
                          onComplete()
                        }, 1000)
                      })
                    }}
                  >
                    Instagram
                  </Button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-2">點擊任一平台即可完成任務並獲得獎勵</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Completed state */}
      {isCompleted && (
        <div className="px-4 pb-4 pt-0">
          <div className="border-t border-green-100 pt-3">
            <p className="text-sm text-green-600 flex items-center">
              <Check className="h-4 w-4 mr-1" />
              任務已完成！獎勵已發放到您的帳戶
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
