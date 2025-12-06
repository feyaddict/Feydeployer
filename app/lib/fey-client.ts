import { createPublicClient, createWalletClient, custom, http } from "viem"
import { base } from "viem/chains"
import { FeySDK } from "@feyprotocol/sdk"

let feySDK: FeySDK | null = null

export function initializeFeySDK(walletAddress?: string) {
  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  })

  const walletClient = createWalletClient({
    chain: base,
    transport: custom(window.ethereum!),
  })

  feySDK = new FeySDK({
    publicClient,
    walletClient,
    environment: "base-mainnet",
  })

  return feySDK
}

export function getFeySDK() {
  if (!feySDK) {
    return initializeFeySDK()
  }
  return feySDK
}
