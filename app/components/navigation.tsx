"use client"

import { Rocket, Coins, Gift } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navigation() {
  const pathname = usePathname()

  const tabs = [
    { href: "/", label: "Launch", icon: Rocket },
    { href: "/coins", label: "Coins", icon: Coins },
    { href: "/claim", label: "Claim", icon: Gift },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black via-black to-transparent border-t border-slate-800 px-4 py-4">
      <div className="flex justify-around max-w-2xl mx-auto">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-lg transition-all ${
                isActive
                  ? "text-cyan-400 bg-slate-900/60 border border-slate-700"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
