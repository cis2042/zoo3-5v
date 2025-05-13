"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

interface LineConnectButtonProps {
  onClick: () => void
  isConnected?: boolean
  isLoading?: boolean
  className?: string
}

export function LineConnectButton({
  onClick,
  isConnected = false,
  isLoading = false,
  className,
}: LineConnectButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading || isConnected}
      className={cn(
        "w-full bg-[#06C755] hover:bg-[#05A847] text-white font-medium py-3 rounded-md flex items-center justify-center gap-2 transition-all duration-200",
        isConnected && "bg-[#05A847] opacity-80",
        isLoading && "opacity-70",
        className,
      )}
    >
      <Image src="/images/line-wallet-icon.png" alt="LINE" width={24} height={24} className="object-contain" />
      <span>{isConnected ? "已連接" : isLoading ? "連接中..." : "Connect"}</span>
    </button>
  )
}
