"use client"

import type { Address } from "viem"
import { getFeySDK, initializeFeySDK } from "@/app/lib/fey-client"
import type { LaunchCoinParams } from "@/app/lib/types"
import { DexScreenerClient, deriveTicksFromFeyUsdPrice } from "@feyprotocol/sdk"

export async function launchToken(params: LaunchCoinParams, userAddress: Address) {
  try {
    const sdk = initializeFeySDK(userAddress)

    // Get FEY price for tick derivation
    const dexClient = new DexScreenerClient()
    const priceQuote = await dexClient.getFeyPriceQuote()

    // Derive liquidity pool ticks based on FEY price
    const ticks = deriveTicksFromFeyUsdPrice({
      feyPriceUsd: priceQuote.usedPriceUsd,
    })

    // Resolve partner addresses from usernames (would use Farcaster API)
    const resolvedPartners = params.feePartners.map((partner) => ({
      recipient: userAddress, // Placeholder: would resolve from Farcaster
      bps: partner.bps,
    }))

    // Build token config for FEY SDK
    const tokenConfig = {
      name: params.name,
      symbol: params.ticker.toUpperCase(),
      image: params.image,
      tokenAdmin: userAddress,
      metadata: {
        description: params.description,
      },
      context: {
        interface: "farcaster",
        platform: "frames",
        messageId: Math.random().toString(),
        id: `${Date.now()}`,
      },
      devBuy: {
        ethAmount: 0.01, // 0.01 ETH initial buy
      },
      rewards: {
        recipients: [
          {
            recipient: userAddress,
            bps: 10000 - resolvedPartners.reduce((sum, p) => sum + p.bps, 0),
          },
          ...resolvedPartners,
        ],
      },
      pool: {
        positions: "Standard" as const,
        tickLower: ticks.tickLower,
        tickUpper: ticks.tickUpper,
      },
    }

    // Deploy token using FEY SDK
    const result = await sdk.deployToken({
      token: tokenConfig,
    })

    // Wait for transaction confirmation
    const { address } = await result.waitForTransaction()

    return {
      success: true,
      tokenAddress: address,
      txHash: result.txHash,
    }
  } catch (error) {
    console.error("Failed to launch token:", error)
    throw new Error(`Token launch failed: ${(error as Error).message}`)
  }
}

export async function claimUserRevenue(userAddress: Address) {
  try {
    const sdk = getFeySDK()

    const result = await sdk.claimFees({
      feeOwner: userAddress,
    })

    const receipt = await result.waitForReceipt()

    return {
      success: true,
      txHash: result.hash,
      receipt,
    }
  } catch (error) {
    console.error("Failed to claim fees:", error)
    throw new Error(`Claim failed: ${(error as Error).message}`)
  }
}
