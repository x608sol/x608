/**
 * Express middleware for x608 protocol
 */

import type { Request, Response, NextFunction } from "express"
import { X608ChallengeGenerator } from "../x608/challenge"
import type { X608Config } from "../types/x608.types"
import { EscrowManager } from "../x608/escrow"
import { IdempotencyManager } from "../x608/idempotency"

export function x608Middleware(config: X608Config) {
  const challengeGen = new X608ChallengeGenerator(config)
  const escrowManager = new EscrowManager()
  const idempotencyManager = new IdempotencyManager()

  return async (req: Request, res: Response, next: NextFunction) => {
    const paymentHeader = req.headers["x-608-payment"] as string

    if (!paymentHeader) {
      // No payment provided, send 402 challenge
      const challenge = await challengeGen.generateChallenge()
      const headers = challengeGen.generateHeaders(challenge)

      res.status(402)
      Object.entries(headers).forEach(([key, value]) => {
        res.setHeader(key, value)
      })

      return res.json({
        error: "Payment Required",
        challenge: challenge.challengeId,
        routes: challenge.routes.map((r) => r.asset),
        priceUSD: challenge.priceUSD,
      })
    }

    // Verify payment (simplified - in production, verify on-chain)
    try {
      const payment = JSON.parse(paymentHeader)

      // Check idempotency
      if (idempotencyManager.hasPayment(payment.idempotencyKey)) {
        console.log("[x608] Duplicate payment detected, using cached result")
        return next()
      }

      // Record payment
      idempotencyManager.recordPayment(payment.idempotencyKey, payment)

      // Create escrow if configured
      if (config.escrowSeconds) {
        escrowManager.createEscrow(payment, undefined, config.escrowSeconds)
      }

      // Payment verified, proceed
      next()
    } catch (error) {
      res.status(400).json({
        error: "Invalid payment",
        message: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }
}
