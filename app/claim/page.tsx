"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useFarcaster } from "@/app/lib/farcaster-context"
import { getUserRevenue } from "@/app/lib/revenue-service"
import { claimUserRevenue } from "@/app/lib/token-service"
import type { UserRevenue } from "@/app/lib/types"
import { Loader2, AlertCircle, CheckCircle } from "lucide-react"

export default function ClaimPage() {
  const { user, isConnected } = useFarcaster()
  const [revenue, setRevenue] = useState<UserRevenue | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClaiming, setIsClaiming] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")

  const loadRevenue = async () => {
    if (!user) return

    setIsLoading(true)
    setError("")

    try {
      const userRevenue = await getUserRevenue(user as any)
      setRevenue(userRevenue)
    } catch (err) {
      setError("Failed to load revenue. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected && user) {
      loadRevenue()
    } else {
      setIsLoading(false)
    }
  }, [isConnected, user])

  const handleClaim = async () => {
    if (!user || !revenue || revenue.pending === "0") return

    setIsClaiming(true)
    setError("")
    setSuccess("")

    try {
      const result = await claimUserRevenue(user as any)

      setSuccess(`Successfully claimed! Transaction: ${result.txHash.slice(0, 10)}...`)

      // Reload revenue after claim
      await loadRevenue()
    } catch (err) {
      setError((err as Error).message || "Failed to claim revenue")
    } finally {
      setIsClaiming(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white pb-20">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-8">Claim your revenue</h1>

        {error && (
          <div className="bg-red-900/20 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex gap-3 mb-6">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-900/20 border border-green-700 text-green-300 px-4 py-3 rounded-lg flex gap-3 mb-6">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p>{success}</p>
          </div>
        )}

        {!isConnected ? (
          <div className="text-center py-12 bg-slate-900/50 rounded-lg border border-slate-800">
            <p className="text-slate-400">Connect wallet to claim revenue</p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
          </div>
        ) : !revenue || (revenue.pending === "0" && revenue.claimed === "0") ? (
          <div className="text-center py-12 bg-slate-900/50 rounded-lg border border-slate-800 p-8">
            <h3 className="text-lg font-semibold mb-2">Nothing to claim yet...</h3>
            <p className="text-slate-400 mb-4">Share your coins and earn revenue from fees</p>
            <Button onClick={() => (window.location.href = "/")} className="bg-cyan-600 hover:bg-cyan-700 text-white">
              Launch a coin
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Revenue Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                <p className="text-sm text-slate-400 mb-2">Total Revenue</p>
                <p className="text-2xl font-bold">{revenue.total}</p>
                <p className="text-xs text-slate-500 mt-1">ETH</p>
              </div>

              <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                <p className="text-sm text-slate-400 mb-2">Pending</p>
                <p className="text-2xl font-bold text-cyan-400">{revenue.pending}</p>
                <p className="text-xs text-slate-500 mt-1">ETH</p>
              </div>

              <div className="bg-slate-900 rounded-lg p-6 border border-slate-800 col-span-2">
                <p className="text-sm text-slate-400 mb-2">Claimed</p>
                <p className="text-2xl font-bold text-green-400">{revenue.claimed}</p>
                <p className="text-xs text-slate-500 mt-1">ETH</p>
              </div>
            </div>

            {/* Claim Button */}
            <Button
              onClick={handleClaim}
              disabled={isClaiming || revenue.pending === "0"}
              className="w-full bg-white text-black hover:bg-gray-200 font-bold py-3 rounded-full disabled:opacity-50 text-base"
            >
              {isClaiming ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Claiming...
                </>
              ) : (
                `Claim ${revenue.pending} ETH`
              )}
            </Button>

            {/* Info Text */}
            <p className="text-xs text-slate-500 text-center">
              Earn revenue when other users trade the tokens you created. Claimed fees are sent to your wallet.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
