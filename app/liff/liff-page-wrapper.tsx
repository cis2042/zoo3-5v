"use client"

import { LiffProvider } from "../liff-provider"
import LiffPage from "../liff-page"

// Get LIFF ID from environment variables
const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID || "YOUR_LIFF_ID"

export default function LiffPageWrapper() {
  return (
    <LiffProvider liffId={LIFF_ID}>
      <LiffPage />
    </LiffProvider>
  )
}