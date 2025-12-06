"use client"

import { type ReactNode, useState, useEffect } from "react"
import { FarcasterContext } from "@/app/lib/farcaster-context"
import type { FarcasterUser } from "@/app/lib/farcaster-context"

export function Providers({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FarcasterUser | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize Farcaster frame context
    const initFarcaster = async () => {
      try {
        // Check if running in Farcaster frame
        if (typeof window !== "undefined" && window.frameContext) {
          const frameUser = (window as any).frameContext?.user
          if (frameUser) {
            setUser({
              fid: frameUser.fid,
              username: frameUser.username,
              displayName: frameUser.displayName,
              pfpUrl: frameUser.pfpUrl,
            })
            setIsConnected(true)
          }
        }
      } catch (error) {
        console.error("Failed to initialize Farcaster:", error)
      } finally {
        setIsLoading(false)
      }
    }

    initFarcaster()
  }, [])

  return <FarcasterContext.Provider value={{ user, isConnected, isLoading }}>{children}</FarcasterContext.Provider>
}
