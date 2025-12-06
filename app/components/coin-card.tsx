"use client"

import type { LaunchedCoin } from "@/app/lib/types"
import { ExternalLink } from "lucide-react"

interface CoinCardProps {
  coin: LaunchedCoin
}

export function CoinCard({ coin }: CoinCardProps) {
  return (
    <div className="bg-slate-900 rounded-lg p-4 border border-slate-800 hover:border-slate-700 transition">
      <div className="flex gap-4">
        <img src={coin.image || "/placeholder.svg"} alt={coin.name} className="w-16 h-16 rounded-lg object-cover" />
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-white">{coin.name}</h3>
              <p className="text-sm text-slate-400">{coin.ticker}</p>
            </div>
            <a
              href={`https://basescan.io/token/${coin.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <p className="text-xs text-slate-500 mt-2">{coin.holders} holders</p>
        </div>
      </div>
    </div>
  )
}
