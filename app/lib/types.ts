export interface LaunchCoinParams {
  name: string
  ticker: string
  image: string
  description: string
  feePartners: Array<{
    fid: number
    username: string
    bps: number
  }>
}

export interface LaunchedCoin {
  address: string
  name: string
  ticker: string
  image: string
  description: string
  deploymentTx: string
  creator: string
  createdAt: number
  holders: number
}

export interface UserRevenue {
  total: string
  pending: string
  claimed: string
}
