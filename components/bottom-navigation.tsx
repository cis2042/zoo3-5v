"use client"

import type React from "react"

import Link from "next/link"
import { Home, ListTodo, Gift, User } from "lucide-react"

interface BottomNavigationProps {
  activeTab: "home" | "tasks" | "rewards" | "profile"
}

export function BottomNavigation({ activeTab }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-lion-face-dark flex justify-around py-2 z-50 shadow-lion">
      <NavItem href="/" icon={<Home className="h-6 w-6" />} label="首頁" isActive={activeTab === "home"} />
      <NavItem href="/tasks" icon={<ListTodo className="h-6 w-6" />} label="任務" isActive={activeTab === "tasks"} />
      <NavItem href="/rewards" icon={<Gift className="h-6 w-6" />} label="獎勵" isActive={activeTab === "rewards"} />
      <NavItem href="/profile" icon={<User className="h-6 w-6" />} label="成就" isActive={activeTab === "profile"} />
    </div>
  )
}

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center w-full">
      <div className={`${isActive ? "text-lion-orange" : "text-gray-500"}`}>{icon}</div>
      <span className={`text-xs mt-1 ${isActive ? "text-lion-orange font-medium" : "text-gray-500"}`}>{label}</span>
    </Link>
  )
}
