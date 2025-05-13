import Image from "next/image"

interface LionLogoProps {
  variant?: "orange" | "teal"
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function LionLogo({ variant = "orange", size = "md", className = "" }: LionLogoProps) {
  const sizes = {
    sm: { width: 32, height: 32 },
    md: { width: 48, height: 48 },
    lg: { width: 64, height: 64 },
    xl: { width: 96, height: 96 },
  }

  const { width, height } = sizes[size]
  const src = variant === "orange" ? "/images/lion-logo.png" : "/images/lion-logo-teal.png"

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src || "/placeholder.svg"}
        alt="Lion Logo"
        width={width}
        height={height}
        className="animate-bounce-subtle"
      />
    </div>
  )
}
