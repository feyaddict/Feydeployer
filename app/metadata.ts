import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Token Launchpad - Launch. Share. Claim.",
  description:
    "Create and distribute your token on Base using FEY Protocol. Launch coins, share with your community, and earn revenue from trading fees.",
  keywords: ["token", "launchpad", "fey", "base", "farcaster", "crypto"],
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}
