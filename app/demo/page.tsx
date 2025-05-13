'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { LionLogo } from '@/components/lion-logo'

export default function DemoPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState('home')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSearch = () => {
    setLoading(true)
    
    // 模擬加載
    setTimeout(() => {
      setLoading(false)
      
      toast({
        title: "演示功能",
        description: "這是一個演示頁面，實際功能需要連接到 Kaia Chain。",
      })
    }, 1500)
  }

  return (
    <div className="flex flex-col min-h-screen bg-lion-face-light">
      {/* Header */}
      <header className="bg-gradient-to-r from-lion-orange to-lion-red text-white p-4 text-center shadow-md">
        <div className="flex items-center justify-center gap-2">
          <LionLogo size="sm" />
          <h1 className="text-2xl font-bold">ZOO3 演示</h1>
        </div>
        <p className="mt-1 text-sm">GitHub Pages 演示版本</p>
      </header>

      <main className="flex-1 container max-w-4xl mx-auto p-4 space-y-6">
        <Card className="border-2 border-lion-orange/20 shadow-lion">
          <CardHeader className="pb-2">
            <CardTitle className="text-lion-accent">ZOO3 平台演示</CardTitle>
            <CardDescription>
              這是 ZOO3 平台的 GitHub Pages 演示版本。實際功能需要連接到 Kaia Chain 和 Supabase 後端。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              ZOO3 是一個區塊鏈獎勵平台，用戶可以通過完成任務獲得代幣獎勵，包括 KAIA、ZOO 和 WBTC (Kaia Chain)。
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card className="bg-lion-face border-lion-face-dark">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">每日登入獎勵</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-lion-orange">+1 KAIA</p>
                  <p className="text-xs text-gray-600">連續登入 7 天可獲得額外獎勵</p>
                </CardContent>
              </Card>
              
              <Card className="bg-lion-face border-lion-face-dark">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">任務獎勵</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-lion-orange">+5 ZOO</p>
                  <p className="text-xs text-gray-600">完成各種任務獲得代幣獎勵</p>
                </CardContent>
              </Card>
              
              <Card className="bg-lion-face border-lion-face-dark">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">推薦獎勵</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-lion-orange">+10 ZOO</p>
                  <p className="text-xs text-gray-600">邀請朋友加入獲得雙方獎勵</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild variant="orange" className="w-full">
              <Link href="/">返回主頁</Link>
            </Button>
          </CardFooter>
        </Card>

        <Tabs defaultValue="wallet" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="wallet">WBTC 錢包演示</TabsTrigger>
            <TabsTrigger value="tasks">任務系統演示</TabsTrigger>
          </TabsList>
          
          <TabsContent value="wallet" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lion-accent">WBTC 錢包 (Kaia Chain)</CardTitle>
                <CardDescription>
                  查詢 Kaia Chain 上的 WBTC 餘額和交易歷史
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="address">Kaia Chain 地址</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="address"
                      placeholder="輸入 Kaia Chain 地址" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <Button 
                      variant="orange" 
                      onClick={handleSearch}
                      disabled={!address || loading}
                    >
                      {loading ? "查詢中..." : "查詢"}
                    </Button>
                  </div>
                </div>
                
                <Card className="bg-gray-50 border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">WBTC 餘額</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-lion-orange">0.00000000 WBTC</p>
                    <p className="text-xs text-gray-600">≈ $0.00 USD</p>
                  </CardContent>
                </Card>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                  <p className="text-gray-500 text-sm">這是演示頁面，實際功能需要連接到 Kaia Chain</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/wallet">前往錢包頁面</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lion-accent">任務系統演示</CardTitle>
                <CardDescription>
                  完成任務獲取代幣獎勵
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  {[
                    { title: "加入 Discord 社區", reward: "5 ZOO", completed: true },
                    { title: "關注官方 Twitter", reward: "3 ZOO", completed: false },
                    { title: "分享到社交媒體", reward: "10 ZOO", completed: false },
                    { title: "完成 KYC 認證", reward: "20 ZOO", completed: false },
                    { title: "參與社區投票", reward: "5 ZOO", completed: false }
                  ].map((task, index) => (
                    <Card key={index} className="bg-gray-50 border-gray-200">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{task.title}</p>
                          <p className="text-xs text-gray-600">獎勵: {task.reward}</p>
                        </div>
                        <Button 
                          variant={task.completed ? "teal" : "orange"} 
                          size="sm"
                          disabled={task.completed}
                          onClick={() => {
                            toast({
                              title: "演示功能",
                              description: "這是一個演示頁面，實際功能需要連接到後端。",
                            })
                          }}
                        >
                          {task.completed ? "已完成" : "完成任務"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                  <p className="text-gray-500 text-sm">這是演示頁面，實際功能需要連接到後端</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/tasks">前往任務頁面</Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <footer className="bg-gray-100 p-4 text-center text-sm text-gray-600">
        <p>ZOO3 平台 - GitHub Pages 演示版本</p>
        <p className="mt-1">
          <a 
            href="https://github.com/cis2042/zoo3-5v" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-lion-orange hover:underline"
          >
            查看 GitHub 倉庫
          </a>
        </p>
      </footer>
    </div>
  )
}
