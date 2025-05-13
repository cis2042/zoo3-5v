"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Share2, MessageSquare, ChevronDown, ChevronUp, Check, ExternalLink } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { LionLogo } from "@/components/lion-logo"
import { toast } from "@/components/ui/use-toast"
import { useTasks } from "@/hooks/use-tasks"
import { useAuth } from "@/context/auth-context"

export default function TasksPage() {
  const { user } = useAuth()
  const { tasks, completedTasks, completeTask, isLoading } = useTasks()

  // Function to handle task completion
  const handleCompleteTask = async (taskId: string, reward: string) => {
    if (!user) {
      toast({
        title: "請先登入",
        description: "您需要先登入才能完成任務",
      })
      return
    }
    
    if (completedTasks.includes(taskId)) {
      toast({
        title: "任務已完成",
        description: "您已經完成了這個任務",
      })
      return
    }
    
    await completeTask(taskId)
  }

  // Simulate Discord OAuth callback
  const handleDiscordCallback = (taskId: string) => {
    // In a real app, this would be triggered by the OAuth callback
    completeTask(taskId)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-lion-face-light pb-16">
        <header className="bg-gradient-to-r from-lion-orange to-lion-red text-white p-4 text-center shadow-md">
          <div className="flex items-center justify-center gap-2">
            <LionLogo size="sm" />
            <h1 className="text-2xl font-bold">任務中心</h1>
          </div>
        </header>
        
        <main className="flex-1 container max-w-md mx-auto p-4 flex items-center justify-center">
          <p className="text-lg text-gray-500">載入中...</p>
        </main>
        
        <BottomNavigation activeTab="tasks" />
      </div>
    )
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
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              id={task.id}
              icon={
                task.task_type === 'discord' ? (
                  <MessageSquare className="h-5 w-5 text-white" />
                ) : task.task_type === 'social_share' ? (
                  <Share2 className="h-5 w-5 text-white" />
                ) : (
                  <Check className="h-5 w-5 text-white" />
                )
              }
              title={task.title}
              description={task.description}
              reward={`+${task.reward_amount} $${task.reward_token}`}
              isCompleted={completedTasks.includes(task.id)}
              onComplete={() => handleCompleteTask(task.id, `+${task.reward_amount} $${task.reward_token}`)}
              onDiscordCallback={() => handleDiscordCallback(task.id)}
              taskType={task.task_type}
              redirectUrl={task.redirect_url}
            />
          ))}
          
          {tasks.length === 0 && (
            <div className="bg-white rounded-xl border border-lion-face-dark p-8 text-center">
              <p className="text-gray-500">暫無可用任務</p>
            </div>
          )}
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
  taskType: string
  redirectUrl?: string | null
  isCompleted?: boolean
  onComplete: () => void
  onDiscordCallback?: () => void
}

function TaskCard({
  id,
  icon,
  title,
  description,
  reward,
  taskType,
  redirectUrl,
  isCompleted = false,
  onComplete,
  onDiscordCallback,
}: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Toggle expanded state
  const toggleExpand = () => {
    if (!isCompleted) {
      setIsExpanded(!isExpanded)
    }
  }

  // Handle Discord join
  const handleExternalRedirect = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent card from collapsing when clicking the button

    if (redirectUrl) {
      window.open(redirectUrl, "_blank")

      // Simulate OAuth callback after 2 seconds (in a real app, this would be handled by the OAuth redirect)
      if (taskType === "discord" && onDiscordCallback) {
        setTimeout(() => {
          onDiscordCallback()
        }, 2000)
      }
    }
  }

  // Handle social media sharing
  const handleSocialShare = (platform: string) => {
    const shareUrl = "https://zoo3.app"
    const shareText = "我正在使用 ZOO3 獲取加密獎勵！立即加入我吧！"
    
    let url = ''
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        break
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        break
      case 'instagram':
        // Instagram doesn't have a direct share URL, so we'll just copy the text
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
        toast({
          title: "已複製文字",
          description: "分享內容已複製到剪貼簿。請在 Instagram 手動分享。",
        })
        onComplete()
        return
    }
    
    if (url) {
      window.open(url, "_blank")
      
      // In a real app, we would verify the share actually happened
      // For demo purposes, we'll just count it as completed after a delay
      setTimeout(() => {
        onComplete()
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
            {taskType === "discord" && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  加入我們的 Discord 社區，與其他 ZOO3 用戶交流，獲取最新資訊和獨家福利。
                </p>
                <Button
                  variant="teal"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleExternalRedirect}
                >
                  <ExternalLink className="h-4 w-4" />
                  加入 Discord 社區
                </Button>
              </div>
            )}

            {taskType === "social_share" && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">在您的社交媒體上分享 ZOO3，幫助我們擴大社區，同時獲得獎勵。</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    className="text-blue-500 border-blue-200"
                    onClick={() => handleSocialShare('twitter')}
                  >
                    Twitter
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-blue-600 border-blue-200"
                    onClick={() => handleSocialShare('facebook')}
                  >
                    Facebook
                  </Button>
                  <Button 
                    variant="outline" 
                    className="text-pink-500 border-pink-200"
                    onClick={() => handleSocialShare('instagram')}
                  >
                    Instagram
                  </Button>
                </div>
              </div>
            )}

            {taskType !== "discord" && taskType !== "social_share" && redirectUrl && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  完成這個任務以獲得獎勵。
                </p>
                <Button
                  variant="teal"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleExternalRedirect}
                >
                  <ExternalLink className="h-4 w-4" />
                  開始任務
                </Button>
              </div>
            )}

            {taskType !== "discord" && taskType !== "social_share" && !redirectUrl && (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  完成這個任務以獲得獎勵。
                </p>
                <Button
                  variant="teal"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => onComplete()}
                >
                  <Check className="h-4 w-4" />
                  標記為已完成
                </Button>
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