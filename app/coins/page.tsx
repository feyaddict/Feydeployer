"use client"

import { useState, useEffect } from "react"
import { CoinCard } from "@/app/components/coin-card"
import { useFarcaster } from "@/app/lib/farcaster-context"
import { getUserCoins } from "@/app/lib/coins-service"
import type { LaunchedCoin } from "@/app/lib/types"
import { RotateCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CoinsPage() {
  const { user, isConnected } = useFarcaster()
  const [coins, setCoins] = useState<LaunchedCoin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")

  const loadCoins = async () => {
    if (!user) return

    setIsLoading(true)
    setError("")

    try {
      const userCoins = await getUserCoins(user as any)
      setCoins(userCoins)
    } catch (err) {
      setError("Failed to load coins. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected && user) {
      loadCoins()
    } else {
      setIsLoading(false)
    }
  }, [isConnected, user])

  return (
    <main className="min-h-screen bg-black text-white pb-20">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Your coins</h1>
          <button
            onClick={loadCoins}
            disabled={isLoading}
            className="text-cyan-400 hover:text-cyan-300 disabled:opacity-50 transition"
          >
            <RotateCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex gap-3 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {!isConnected ? (
          <div className="text-center py-12">
            <p className="text-slate-400">Connect wallet to view your coins</p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <RotateCw className="w-6 h-6 text-cyan-400 animate-spin" />
          </div>
        ) : coins.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/50 rounded-lg border border-slate-800 p-8">
            <h3 className="text-lg font-semibold mb-2">Your launched coins will appear here</h3>
            <p className="text-slate-400">Create your first coin using the Launch tab</p>
            <Button
              onClick={() => (window.location.href = "/")}
              className="mt-4 bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Go to Launch
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {coins.map((coin) => (
              <CoinCard key={coin.address} coin={coin} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
