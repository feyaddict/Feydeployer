"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Upload, X } from "lucide-react"
import { useFarcaster } from "@/app/lib/farcaster-context"
import { launchToken } from "@/app/lib/token-service"
import type { LaunchCoinParams } from "@/app/lib/types"

interface LaunchFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (tokenAddress: string) => void
}

export function LaunchForm({ isOpen, onClose, onSuccess }: LaunchFormProps) {
  const { user } = useFarcaster()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>("")
  const [image, setImage] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    ticker: "",
    description: "",
  })
  const [partners, setPartners] = useState<Array<{ username: string; bps: number }>>([])
  const [partnerSearch, setPartnerSearch] = useState("")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setError("")
    setIsLoading(true)

    try {
      const launchParams: LaunchCoinParams = {
        name: formData.name,
        ticker: formData.ticker,
        image,
        description: formData.description,
        feePartners: partners.map((p) => ({
          fid: 0, // Would be resolved from search
          username: p.username,
          bps: p.bps,
        })),
      }

      const result = await launchToken(launchParams, user as any) // Type conversion for demo

      // Reset form
      setFormData({ name: "", ticker: "", description: "" })
      setImage("")
      setPartners([])

      if (onSuccess) {
        onSuccess(result.tokenAddress)
      }

      onClose()
    } catch (err) {
      setError((err as Error).message || "Failed to launch token")
    } finally {
      setIsLoading(false)
    }
  }

  const addPartner = (username: string) => {
    if (username && !partners.find((p) => p.username === username)) {
      setPartners([...partners, { username, bps: 0 }])
      setPartnerSearch("")
    }
  }

  const removePartner = (username: string) => {
    setPartners(partners.filter((p) => p.username !== username))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-950 border-slate-800 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Launch.
            <br />
            Share. Claim.
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-700 text-red-300 px-3 py-2 rounded text-sm">{error}</div>
          )}

          {/* Image Upload */}
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-lg p-8 cursor-pointer hover:border-slate-600 transition">
            {image ? (
              <img src={image || "/placeholder.svg"} alt="preview" className="w-16 h-16 rounded" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-slate-400 mb-2" />
                <span className="text-sm text-slate-400">Add image</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </label>

          {/* Coin Name */}
          <Input
            placeholder="Coin name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-slate-900 border-slate-700 text-white placeholder-slate-500"
            required
          />

          {/* Coin Ticker */}
          <Input
            placeholder="Coin ticker"
            value={formData.ticker}
            onChange={(e) => setFormData({ ...formData, ticker: e.target.value.toUpperCase() })}
            className="bg-slate-900 border-slate-700 text-white placeholder-slate-500"
            required
          />

          {/* Description */}
          <Input
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-slate-900 border-slate-700 text-white placeholder-slate-500"
          />

          {/* Fee Partners */}
          <div>
            <label className="text-sm text-slate-300 mb-2 block">Split fees with...</label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Search /channel or user"
                value={partnerSearch}
                onChange={(e) => setPartnerSearch(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white placeholder-slate-500 text-sm"
              />
              {partnerSearch && (
                <Button
                  type="button"
                  onClick={() => addPartner(partnerSearch)}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm"
                >
                  Add
                </Button>
              )}
            </div>

            {/* Partner Tags */}
            <div className="flex flex-wrap gap-2">
              {user && (
                <div className="bg-slate-900 rounded-full px-3 py-1 text-sm flex items-center gap-2 border border-slate-700">
                  {user.username}
                </div>
              )}
              {partners.map((p) => (
                <div
                  key={p.username}
                  className="bg-slate-900 rounded-full px-3 py-1 text-sm flex items-center gap-2 border border-slate-700"
                >
                  {p.username}
                  <button
                    type="button"
                    onClick={() => removePartner(p.username)}
                    className="opacity-50 hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading || !formData.name || !formData.ticker}
            className="w-full bg-white text-black hover:bg-gray-200 font-bold py-2 rounded-full disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Launching...
              </>
            ) : (
              "Launch!"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
