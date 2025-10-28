/**
 * x402 Challenge Generation
 * Creates payment challenges for the original x402 protocol
 */

import type { X402Challenge, X402Config, X402Headers } from "../types/x402.types"
import { generateId } from "../utils/crypto"

export class X402ChallengeGenerator {
  private config: X402Config

  constructor(config: X402Config) {
    this.config = config
  }

  generateChallenge(): X402Challenge {
    const now = Date.now()
    const expirySeconds = this.config.expirySeconds || 300 // 5 minutes default

    return {
      challengeId: generateId("x402"),
      priceUSD: this.config.priceUSD,
      asset: this.config.asset,
      recipientAddress: this.config.recipientAddress,
      chainId: this.config.chainId,
      timestamp: now,
      expiresAt: now + expirySeconds * 1000,
    }
  }

  generateHeaders(challenge: X402Challenge): X402Headers {
    return {
      "X-402-Challenge": challenge.challengeId,
      "X-402-Price-USD": challenge.priceUSD.toString(),
      "X-402-Asset": challenge.asset,
      "X-402-Recipient": challenge.recipientAddress,
      "X-402-Chain-Id": challenge.chainId.toString(),
      "X-402-Expires": new Date(challenge.expiresAt).toISOString(),
    }
  }

  isExpired(challenge: X402Challenge): boolean {
    return Date.now() > challenge.expiresAt
  }
}
