"use client"

import { useState } from "react"
import { LaunchForm } from "@/app/components/launch-form"
import { Button } from "@/components/ui/button"
import { useFarcaster } from "@/app/lib/farcaster-context"
import { Rocket } from "lucide-react"

export default function LaunchPage() {
  const { isConnected, user } = useFarcaster()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [launchSuccess, setLaunchSuccess] = useState<string>("")

  const handleLaunchSuccess = (tokenAddress: string) => {
    setLaunchSuccess(tokenAddress)
    setTimeout(() => setLaunchSuccess(""), 3000)
  }

  return (
    <main className="min-h-screen bg-black text-white pb-24">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 pt-4">
          <div className="flex justify-center mb-4">
            <Rocket className="w-12 h-12 text-cyan-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Launch. Share. Claim.</h1>
          <p className="text-lg text-slate-400 text-balance">
            Create your token on Base and earn revenue from your community
          </p>
        </div>

        {!isConnected ? (
          <div className="bg-gradient-to-b from-slate-900/50 to-slate-900/20 rounded-xl p-12 border border-slate-800 text-center">
            <h2 className="text-xl font-semibold mb-3">Connect Your Wallet</h2>
            <p className="text-slate-400 mb-6">Sign in with Farcaster to create and manage your tokens</p>
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-2 rounded-full font-semibold">
              Connect Wallet
            </Button>
          </div>
        ) : (
          <>
            {launchSuccess && (
              <div className="bg-green-900/20 border border-green-700 text-green-300 px-4 py-3 rounded-lg mb-6 text-center text-sm">
                Token launched! Contract: {launchSuccess.slice(0, 10)}...
              </div>
            )}

            {/* Quick Start Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl p-8 border border-slate-700/50 text-center mb-8">
              <h2 className="text-2xl font-bold mb-3">Ready to launch?</h2>
              <p className="text-slate-400 mb-6">Create your token in seconds and start earning revenue</p>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-white text-black hover:bg-gray-200 font-bold px-8 py-3 rounded-full"
              >
                Launch a coin
              </Button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800 text-center">
                <div className="text-2xl font-bold text-cyan-400 mb-2">1</div>
                <p className="text-xs text-slate-400">Create</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800 text-center">
                <div className="text-2xl font-bold text-cyan-400 mb-2">2</div>
                <p className="text-xs text-slate-400">Share</p>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-800 text-center">
                <div className="text-2xl font-bold text-cyan-400 mb-2">3</div>
                <p className="text-xs text-slate-400">Earn</p>
              </div>
            </div>

            <LaunchForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSuccess={handleLaunchSuccess} />
          </>
        )}
      </div>
    </main>
  )
}
