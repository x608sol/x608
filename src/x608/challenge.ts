/**
 * x608 Challenge Generation
 * Enhanced challenges with multi-currency, escrow, and streaming
 */

import type { X608Challenge, X608Config, X608Headers, PaymentRoute } from "../types/x608.types"
import { generateId } from "../utils/crypto"
import { getExchangeRates } from "../utils/exchange-rates"

export class X608ChallengeGenerator {
  private config: X608Config

  constructor(config: X608Config) {
    this.config = config
  }

  async generateChallenge(contentHash?: string): Promise<X608Challenge> {
    const now = Date.now()
    const expirySeconds = 300 // 5 minutes

    // Get current exchange rates for all routes
    const rates = await getExchangeRates(this.config.routes)
    const routes: PaymentRoute[] = this.config.routes.map((route) => ({
      asset: route,
      rate: rates[route] || 1.0,
      rateSource: "oracle:coinbase-spot",
      estimatedGas: "0.001", // Simplified,
    }))

    const challenge: X608Challenge = {
      challengeId: generateId("x608"),
      priceUSD: this.config.priceUSD,
      routes,
      settleAsset: this.config.settleAsset,
      recipientAddress: this.config.recipientAddress,
      contentHash,
      escrowSeconds: this.config.escrowSeconds,
      idempotencyKey: generateId("ik"),
      mode: this.config.enableStreaming ? "stream" : "single",
      timestamp: now,
      expiresAt: now + expirySeconds * 1000,
    }

    if (this.config.enableStreaming && this.config.streamUnit && this.config.streamRate) {
      challenge.streamConfig = {
        unit: this.config.streamUnit,
        ratePerUnit: this.config.streamRate,
        budgetCap: this.config.priceUSD,
        currentUsage: 0,
      }
    }

    return challenge
  }

  generateHeaders(challenge: X608Challenge): X608Headers {
    const headers: X608Headers = {
      "X-608-Challenge": challenge.challengeId,
      "X-608-Price-USD": challenge.priceUSD.toString(),
      "X-608-Routes": JSON.stringify(challenge.routes.map((r) => r.asset)),
      "X-608-Settle": challenge.settleAsset,
      "X-608-Idempotency-Key": challenge.idempotencyKey,
    }

    if (challenge.contentHash) {
      headers["X-608-Hash"] = challenge.contentHash
    }

    if (challenge.escrowSeconds) {
      headers["X-608-Escrow"] = `${challenge.escrowSeconds}s`
    }

    if (challenge.mode === "stream" && challenge.streamConfig) {
      headers["X-608-Mode"] = `stream; cap=${challenge.streamConfig.budgetCap}`
    }

    headers["X-608-Quote-Ref"] = challenge.routes.map((r) => r.rateSource).join(",")

    return headers
  }

  isExpired(challenge: X608Challenge): boolean {
    return Date.now() > challenge.expiresAt
  }
}
