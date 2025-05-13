import { Metadata } from 'next'
import ProfilePageClient from './profile-client'

export const metadata: Metadata = {
  title: "ZOO3 - 用戶成就",
  description: "查看您的 ZOO3 成就",
}

export default function Page() {
  return <ProfilePageClient />
}