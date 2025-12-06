"use client"

import { createContext, useContext } from "react"

export interface FarcasterUser {
  fid: number
  username: string
  displayName: string
  pfpUrl?: string
}

export interface FarcasterContextType {
  user: FarcasterUser | null
  isConnected: boolean
  isLoading: boolean
}

export const FarcasterContext = createContext<FarcasterContextType | undefined>(undefined)

export function useFarcaster() {
  const context = useContext(FarcasterContext)
  if (!context) {
    throw new Error("useFarcaster must be used within FarcasterProvider")
  }
  return context
}
