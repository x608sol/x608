/**
 * x608 Protocol Types
 * Enhanced payment protocol with multi-currency, escrow, and streaming
 */

export interface X608Challenge {
  challengeId: string
  priceUSD: number
  routes: PaymentRoute[]
  settleAsset: string
  recipientAddress: string
  contentHash?: string
  escrowSeconds?: number
  idempotencyKey: string
  mode?: "single" | "stream"
  streamConfig?: StreamConfig
  timestamp: number
  expiresAt: number
}

export interface PaymentRoute {
  asset: string // e.g., "base:USDC", "sol:USDC", "tron:USDT"
  chainId?: number
  rate: number // Exchange rate to USD
  rateSource: string // e.g., "oracle:coinbase-spot"
  estimatedGas?: string
}

export interface StreamConfig {
  unit: "kb" | "token" | "call"
  ratePerUnit: number
  budgetCap: number
  currentUsage?: number
}

export interface X608Payment {
  challengeId: string
  idempotencyKey: string
  txHash: string
  fromAddress: string
  amount: string
  route: string
  timestamp: number
  escrowReleaseAt?: number
}

export interface X608Config {
  priceUSD: number
  routes: string[]
  settleAsset: string
  recipientAddress: string
  escrowSeconds?: number
  enableStreaming?: boolean
  streamUnit?: "kb" | "token" | "call"
  streamRate?: number
  enableReputation?: boolean
}

export interface X608Headers {
  "X-608-Challenge": string
  "X-608-Price-USD": string
  "X-608-Routes": string
  "X-608-Settle": string
  "X-608-Hash"?: string
  "X-608-Escrow"?: string
  "X-608-Idempotency-Key": string
  "X-608-Mode"?: string
  "X-608-Quote-Ref"?: string
}

export interface EscrowRecord {
  paymentId: string
  amount: string
  asset: string
  fromAddress: string
  toAddress: string
  contentHash?: string
  releaseAt: number
  status: "held" | "released" | "refunded"
  createdAt: number
}

export interface PolicyWalletConfig {
  dailyCapUSD: number
  allowlist?: string[]
  blocklist?: string[]
  requireApprovalAbove?: number
  teamBudget?: number
  notificationWebhook?: string
}

export interface ReputationScore {
  merchantAddress: string
  totalTransactions: number
  successfulTransactions: number
  refundCount: number
  averageResponseMs: number
  uptimePercent: number
  lastUpdated: number
}

export interface PrivateReceipt {
  paymentId: string
  merchantAddress: string
  amount: string
  asset: string
  timestamp: number
  signature: string
  proof: string // Zero-knowledge proof
}
