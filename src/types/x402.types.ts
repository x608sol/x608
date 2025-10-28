/**
 * x402 Protocol Types
 * Original Coinbase x402 stablecoin payments over HTTP
 */

export interface X402Challenge {
  challengeId: string
  priceUSD: number
  asset: string // e.g., "base:USDC"
  recipientAddress: string
  chainId: number
  timestamp: number
  expiresAt: number
}

export interface X402Payment {
  challengeId: string
  txHash: string
  fromAddress: string
  amount: string
  asset: string
  timestamp: number
}

export interface X402Config {
  priceUSD: number
  asset: string
  recipientAddress: string
  chainId: number
  expirySeconds?: number
}

export interface X402Headers {
  "X-402-Challenge": string
  "X-402-Price-USD": string
  "X-402-Asset": string
  "X-402-Recipient": string
  "X-402-Chain-Id": string
  "X-402-Expires": string
}

export interface X402VerificationResult {
  valid: boolean
  payment?: X402Payment
  error?: string
}
