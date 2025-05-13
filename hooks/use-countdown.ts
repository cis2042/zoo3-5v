"use client"

import { useState, useEffect } from 'react'

interface CountdownProps {
  targetDate: Date | string | number
  onComplete?: () => void
}

interface CountdownResult {
  days: number
  hours: number
  minutes: number
  seconds: number
  isComplete: boolean
}

export function useCountdown({ targetDate, onComplete }: CountdownProps): CountdownResult {
  const [countdown, setCountdown] = useState<CountdownResult>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false
  })

  useEffect(() => {
    const target = new Date(targetDate).getTime()

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const difference = target - now

      if (difference <= 0) {
        // Timer completed
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isComplete: true
        })

        if (onComplete) {
          onComplete()
        }
        
        // Clear interval
        clearInterval(interval)
        return
      }

      // Time calculations
      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setCountdown({
        days,
        hours,
        minutes,
        seconds,
        isComplete: false
      })
    }

    // Calculate initial time
    calculateTimeLeft()

    // Update every second
    const interval = setInterval(calculateTimeLeft, 1000)

    // Cleanup
    return () => clearInterval(interval)
  }, [targetDate, onComplete])

  return countdown
}