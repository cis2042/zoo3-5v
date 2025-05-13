import { Metadata } from 'next'
import RewardsPageClient from './rewards-client'

export const metadata: Metadata = {
  title: "ZOO3 - 獎勵中心",
  description: "查看您的 ZOO3 獎勵",
}

export default function Page() {
  return <RewardsPageClient />
}