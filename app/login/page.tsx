import { Metadata } from 'next'
import LoginPage from './login-client'

export const metadata: Metadata = {
  title: "ZOO3 - 登入",
  description: "登入ZOO3平台",
}

export default function Page() {
  return <LoginPage />
}