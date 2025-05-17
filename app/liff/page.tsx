"use client"

import { LiffProvider } from "../liff-provider"
import LiffPage from "../liff-page"

// Replace with your actual LIFF ID
const LIFF_ID = "YOUR_LIFF_ID"

export default function Page() {
  return (
    <LiffProvider liffId={LIFF_ID}>
      <LiffPage />
    </LiffProvider>
  )
}
