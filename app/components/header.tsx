"use client"

import { useFarcaster } from "@/app/lib/farcaster-context"

export function Header() {
  const { user, isConnected } = useFarcaster()

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-4 bg-black border-b border-slate-800">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full transition-colors ${isConnected ? "bg-green-500" : "bg-slate-600"}`} />
        <span className="text-sm font-medium text-slate-300">{isConnected ? "Connected" : "Disconnected"}</span>
      </div>

      {user && (
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-full border border-slate-800">
          {user.pfpUrl && (
            <img src={user.pfpUrl || "/placeholder.svg"} alt={user.username} className="w-6 h-6 rounded-full" />
          )}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm font-medium">{user.username}</span>
          </div>
        </div>
      )}
    </header>
  )
}
