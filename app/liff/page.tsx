import { Metadata } from 'next'
import LiffPageWrapper from './liff-page-wrapper'

export const metadata: Metadata = {
  title: "ZOO3 - LINE LIFF",
  description: "ZOO3 LIFF App",
}

export default function Page() {
  return <LiffPageWrapper />
}