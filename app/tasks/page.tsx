import { Metadata } from 'next'
import TasksPageClient from './tasks-client'

export const metadata: Metadata = {
  title: "ZOO3 - 任務中心",
  description: "完成任務獲取獎勵",
}

export default function Page() {
  return <TasksPageClient />
}