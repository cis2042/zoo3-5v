"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, MessageSquare, ChevronDown, ChevronUp, Check, ExternalLink, Brain } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { LionLogo } from "@/components/lion-logo"
import { toast } from "@/components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"

export default function TasksPage() {
  const [completedTasks, setCompletedTasks] = useState<string[]>([])

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
          {/* Big5 Personality Test Task */}
          <Big5TaskCard
            id="big5-test"
            icon={<Brain className="h-5 w-5 text-white" />}
            title="完成 Big5 個性量表"
            description="完成 30 題的 Big5 個性量表，了解您的性格特質"
            reward="+0.000001 $WBTC"
            isCompleted={completedTasks.includes("big5-test")}
            onComplete={() => completeTask("big5-test", "+0.000001 $WBTC")}
          />

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
            description="在您的社交媒體帳戶上分享 ZOO3"
            reward="+5 $ZOO"
            isCompleted={completedTasks.includes("social-share")}
            onComplete={() => completeTask("social-share", "+5 $ZOO")}
          />
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab="tasks" />
    </div>
  )
}

// Add the Big5TaskCard component
interface Big5TaskCardProps {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  reward: string
  isCompleted?: boolean
  onComplete: () => void
}

function Big5TaskCard({ id, icon, title, description, reward, isCompleted = false, onComplete }: Big5TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>(Array(30).fill(0))
  const [showResults, setShowResults] = useState(false)

  // Toggle expanded state
  const toggleExpand = () => {
    if (!isCompleted) {
      setIsExpanded(!isExpanded)
    }
  }

  // Handle answer selection
  const handleAnswer = (value: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = Number.parseInt(value)
    setAnswers(newAnswers)
  }

  // Move to next question
  const nextQuestion = () => {
    if (currentQuestion < big5Questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  // Move to previous question
  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  // Complete the task
  const handleComplete = () => {
    onComplete()
    setIsExpanded(false)
    setShowResults(false)
  }

  // Calculate progress percentage
  const progress = ((currentQuestion + 1) / big5Questions.length) * 100

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
          <div className="bg-orange-100 px-3 py-1 rounded-full text-orange-500 font-medium text-sm border border-orange-200 mb-1 flex items-center">
            <Image src="/images/wbtc-token.png" alt="WBTC Token" width={16} height={16} className="mr-1" />
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
          <div className="border-t border-gray-100 pt-3 space-y-4">
            {!showResults ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      問題 {currentQuestion + 1} / {big5Questions.length}
                    </span>
                    <span>{big5Questions[currentQuestion].trait}</span>
                  </div>
                  <Progress value={progress} className="h-2 bg-gray-100" />
                </div>

                <div className="bg-lion-face-light p-4 rounded-lg border border-lion-face">
                  <h4 className="font-medium text-lion-accent mb-4">{big5Questions[currentQuestion].question}</h4>

                  <RadioGroup
                    value={answers[currentQuestion].toString()}
                    onValueChange={handleAnswer}
                    className="space-y-2"
                  >
                    {[
                      { value: "1", label: "非常不同意" },
                      { value: "2", label: "不同意" },
                      { value: "3", label: "中立" },
                      { value: "4", label: "同意" },
                      { value: "5", label: "非常同意" },
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.value} id={`option-${option.value}`} />
                        <Label htmlFor={`option-${option.value}`} className="cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={prevQuestion}
                    disabled={currentQuestion === 0}
                    className="border-lion-orange text-lion-orange"
                  >
                    上一題
                  </Button>
                  <Button variant="orange" onClick={nextQuestion} disabled={answers[currentQuestion] === 0}>
                    {currentQuestion === big5Questions.length - 1 ? "完成測驗" : "下一題"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="bg-lion-face-light p-4 rounded-lg border border-lion-face">
                  <h4 className="font-bold text-lion-accent mb-3 text-center">您的 Big5 個性測驗結果</h4>

                  <div className="space-y-3">
                    {calculateResults(answers).map((result) => (
                      <div key={result.trait} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{result.traitName}</span>
                          <span>{result.score}%</span>
                        </div>
                        <Progress value={result.score} className="h-2" />
                        <p className="text-xs text-gray-600">{result.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  variant="orange"
                  onClick={handleComplete}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Image src="/images/wbtc-token.png" alt="WBTC Token" width={20} height={20} />
                  領取獎勵 (0.000001 WBTC)
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

// Big5 questions data
const big5Questions = [
  { question: "我經常有新的想法和創意", trait: "開放性" },
  { question: "我對藝術、音樂或文學感興趣", trait: "開放性" },
  { question: "我喜歡思考抽象的概念", trait: "開放性" },
  { question: "我喜歡嘗試新事物", trait: "開放性" },
  { question: "我有豐富的想像力", trait: "開放性" },
  { question: "我總是保持我的物品整潔有序", trait: "盡責性" },
  { question: "我是一個可靠的工作者", trait: "盡責性" },
  { question: "我傾向於按計劃行事", trait: "盡責性" },
  { question: "我會堅持不懈地完成任務", trait: "盡責性" },
  { question: "我注重細節", trait: "盡責性" },
  { question: "我喜歡與人交談", trait: "外向性" },
  { question: "我在社交場合感到自在", trait: "外向性" },
  { question: "我通常是活動的發起者", trait: "外向性" },
  { question: "我充滿活力和熱情", trait: "外向性" },
  { question: "我喜歡成為注意力的焦點", trait: "外向性" },
  { question: "我關心他人的感受", trait: "親和性" },
  { question: "我樂於幫助他人", trait: "親和性" },
  { question: "我相信人性本善", trait: "親和性" },
  { question: "我避免與人爭論", trait: "親和性" },
  { question: "我容易原諒他人", trait: "親和性" },
  { question: "我容易感到緊張", trait: "神經質" },
  { question: "我經常擔心事情", trait: "神經質" },
  { question: "我的情緒波動較大", trait: "神經質" },
  { question: "我在壓力下容易感到不安", trait: "神經質" },
  { question: "我有時會感到沮喪", trait: "神經質" },
  { question: "我喜歡探索新的想法", trait: "開放性" },
  { question: "我會按時完成任務", trait: "盡責性" },
  { question: "我喜歡與朋友一起外出", trait: "外向性" },
  { question: "我願意為他人著想", trait: "親和性" },
  { question: "我容易受到批評的影響", trait: "神經質" },
]

// Function to calculate Big5 results
function calculateResults(answers: number[]) {
  // Group questions by trait
  const traitGroups = {
    開放性: [0, 1, 2, 3, 4, 25],
    盡責性: [5, 6, 7, 8, 9, 26],
    外向性: [10, 11, 12, 13, 14, 27],
    親和性: [15, 16, 17, 18, 19, 28],
    神經質: [20, 21, 22, 23, 24, 29],
  }

  // Calculate scores for each trait
  const results = Object.entries(traitGroups).map(([trait, indices]) => {
    const traitAnswers = indices.map((index) => answers[index])
    const sum = traitAnswers.reduce((acc, val) => acc + val, 0)
    const maxPossible = indices.length * 5
    const score = Math.round((sum / maxPossible) * 100)

    // Trait descriptions
    const descriptions = {
      開放性: "您對新經驗持開放態度，喜歡探索創新的想法和概念。",
      盡責性: "您做事有條理、可靠，並且注重細節和計劃。",
      外向性: "您喜歡社交互動，在人群中感到自在並充滿活力。",
      親和性: "您富有同情心，樂於助人，並且重視與他人的和諧關係。",
      神經質: "您可能對壓力較為敏感，情緒波動相對較大。",
    }

    const traitNames = {
      開放性: "開放性 (Openness)",
      盡責性: "盡責性 (Conscientiousness)",
      外向性: "外向性 (Extraversion)",
      親和性: "親和性 (Agreeableness)",
      神經質: "情緒穩定性 (Neuroticism)",
    }

    return {
      trait,
      traitName: traitNames[trait as keyof typeof traitNames],
      score,
      description: descriptions[trait as keyof typeof descriptions],
    }
  })

  return results
}

// Keep the original TaskCard component
interface TaskCardProps {
  id: string
  icon: React.ReactNode
  title: string
  description: string
  reward: string
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
          <div className="bg-lion-face px-3 py-1 rounded-full text-lion-orange font-medium text-sm border border-lion-face-dark mb-1 flex items-center">
            {reward.includes("ZOO") ? (
              <Image src="/images/zoo-token.png" alt="ZOO Token" width={16} height={16} className="mr-1" />
            ) : reward.includes("KAIA") ? (
              <Image src="/images/kaia-token.png" alt="KAIA Token" width={16} height={16} className="mr-1" />
            ) : reward.includes("WBTC") ? (
              <Image src="/images/wbtc-token.png" alt="WBTC Token" width={16} height={16} className="mr-1" />
            ) : null}
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
                <p className="text-sm text-gray-600">在您的社交媒體上分享 ZOO3，幫助我們擴大社區，同時獲得獎勵。</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="text-blue-500 border-blue-200">
                    Twitter
                  </Button>
                  <Button variant="outline" className="text-blue-600 border-blue-200">
                    Facebook
                  </Button>
                  <Button variant="outline" className="text-pink-500 border-pink-200">
                    Instagram
                  </Button>
                </div>
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
