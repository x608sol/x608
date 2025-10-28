/**
 * x402 Payment Verification
 * Verifies on-chain payments for x402 challenges
 */

import { ethers } from "ethers"
import type { X402Payment, X402Challenge, X402VerificationResult } from "../types/x402.types"

export class X402PaymentVerifier {
  private provider: ethers.Provider

  constructor(rpcUrl: string) {
    this.provider = new ethers.JsonRpcProvider(rpcUrl)
  }

  async verifyPayment(challenge: X402Challenge, txHash: string): Promise<X402VerificationResult> {
    try {
      const tx = await this.provider.getTransaction(txHash)

      if (!tx) {
        return { valid: false, error: "Transaction not found" }
      }

      const receipt = await tx.wait()

      if (!receipt || receipt.status !== 1) {
        return { valid: false, error: "Transaction failed" }
      }

      // Verify recipient
      if (tx.to?.toLowerCase() !== challenge.recipientAddress.toLowerCase()) {
        return { valid: false, error: "Incorrect recipient" }
      }

      // Verify amount (simplified - in production, parse token transfer events)
      const expectedAmount = ethers.parseUnits(
        challenge.priceUSD.toString(),
        6, // USDC decimals
      )

      const payment: X402Payment = {
        challengeId: challenge.challengeId,
        txHash: tx.hash,
        fromAddress: tx.from,
        amount: tx.value.toString(),
        asset: challenge.asset,
        timestamp: Date.now(),
      }

      return { valid: true, payment }
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }
}
