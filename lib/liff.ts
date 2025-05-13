// LINE LIFF SDK integration

// Type definitions for LINE LIFF SDK
interface LiffProfile {
  userId: string
  displayName: string
  pictureUrl?: string
  statusMessage?: string
}

interface LiffContext {
  type: "utou" | "room" | "group" | "none"
  viewType: "compact" | "tall" | "full"
  userId?: string
  utouId?: string
  roomId?: string
  groupId?: string
}

interface Liff {
  init: (config: { liffId: string }) => Promise<void>
  isLoggedIn: () => boolean
  login: (options?: { redirectUri?: string }) => void
  logout: () => void
  getProfile: () => Promise<LiffProfile>
  getContext: () => LiffContext
  openWindow: (params: { url: string; external: boolean }) => void
  closeWindow: () => void
  sendMessages: (messages: any[]) => Promise<void>
  scanCode: () => Promise<{ value: string }>
  getAccessToken: () => string
  getIDToken: () => string
  getDecodedIDToken: () => any
  getOS: () => "ios" | "android" | "web"
  getLanguage: () => string
  getVersion: () => string
  isInClient: () => boolean
  isApiAvailable: (apiName: string) => boolean
}

declare global {
  interface Window {
    liff: Liff
  }
}

// Initialize LIFF
export async function initializeLiff(liffId: string): Promise<boolean> {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return false
    }

    // Check if LIFF is already loaded
    if (!window.liff) {
      // Load LIFF SDK dynamically
      await import("@line/liff")
    }

    // Initialize LIFF
    await window.liff.init({ liffId })
    console.log("LIFF initialized successfully")
    return true
  } catch (error) {
    console.error("Failed to initialize LIFF:", error)
    return false
  }
}

// Get user profile
export async function getUserProfile(): Promise<LiffProfile | null> {
  try {
    if (typeof window === "undefined" || !window.liff) {
      return null
    }

    if (!window.liff.isLoggedIn()) {
      console.log("User is not logged in")
      return null
    }

    return await window.liff.getProfile()
  } catch (error) {
    console.error("Failed to get user profile:", error)
    return null
  }
}

// Check if running in LINE environment
export function isInLineApp(): boolean {
  if (typeof window === "undefined" || !window.liff) {
    return false
  }

  return window.liff.isInClient()
}

// Login with LINE
export function loginWithLine(redirectUri?: string): void {
  if (typeof window === "undefined" || !window.liff) {
    return
  }

  window.liff.login({ redirectUri })
}

// Logout from LINE
export function logoutFromLine(): void {
  if (typeof window === "undefined" || !window.liff) {
    return
  }

  window.liff.logout()
  window.location.reload()
}

// Send message to LINE chat
export async function sendMessage(message: string): Promise<boolean> {
  try {
    if (typeof window === "undefined" || !window.liff || !window.liff.isInClient()) {
      return false
    }

    await window.liff.sendMessages([
      {
        type: "text",
        text: message,
      },
    ])

    return true
  } catch (error) {
    console.error("Failed to send message:", error)
    return false
  }
}

// Close LIFF window
export function closeLiffWindow(): void {
  if (typeof window === "undefined" || !window.liff) {
    return
  }

  window.liff.closeWindow()
}

// Get LINE access token
export function getLineAccessToken(): string | null {
  if (typeof window === "undefined" || !window.liff || !window.liff.isLoggedIn()) {
    return null
  }

  return window.liff.getAccessToken()
}
