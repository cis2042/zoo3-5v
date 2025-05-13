import { Metadata } from 'next'
import Home from './home-client'

export const metadata: Metadata = {
  title: "ZOO3 - 獎勵任務平台",
  description: "完成任務獲取獎勵",
}

export default function Page() {
  return <Home />
}