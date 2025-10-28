/**
 * x608 Escrow Manager
 * Holds payments with content verification and auto-refunds
 */

import type { EscrowRecord, X608Payment } from "../types/x608.types"
import { verifyContentHash } from "../utils/crypto"

export class EscrowManager {
  private escrows: Map<string, EscrowRecord> = new Map()
  private refundCallbacks: Map<string, (record: EscrowRecord) => Promise<void>> = new Map()

  createEscrow(payment: X608Payment, contentHash?: string, escrowSeconds = 60): EscrowRecord {
    const record: EscrowRecord = {
      paymentId: payment.challengeId,
      amount: payment.amount,
      asset: payment.route,
      fromAddress: payment.fromAddress,
      toAddress: "", // Set by merchant
      contentHash,
      releaseAt: Date.now() + escrowSeconds * 1000,
      status: "held",
      createdAt: Date.now(),
    }

    this.escrows.set(payment.challengeId, record)

    // Schedule auto-release
    setTimeout(() => {
      this.checkAndRelease(payment.challengeId)
    }, escrowSeconds * 1000)

    return record
  }

  async verifyAndRelease(paymentId: string, content: Buffer): Promise<{ released: boolean; reason: string }> {
    const record = this.escrows.get(paymentId)

    if (!record) {
      return { released: false, reason: "Escrow not found" }
    }

    if (record.status !== "held") {
      return { released: false, reason: `Already ${record.status}` }
    }

    // Verify content hash if provided
    if (record.contentHash) {
      const valid = await verifyContentHash(content, record.contentHash)

      if (!valid) {
        await this.refund(paymentId, "Content hash mismatch")
        return { released: false, reason: "Content verification failed - refunded" }
      }
    }

    record.status = "released"
    this.escrows.set(paymentId, record)

    return { released: true, reason: "Content verified" }
  }

  private async checkAndRelease(paymentId: string): Promise<void> {
    const record = this.escrows.get(paymentId)

    if (!record || record.status !== "held") {
      return
    }

    if (Date.now() >= record.releaseAt) {
      // Auto-release after escrow period
      record.status = "released"
      this.escrows.set(paymentId, record)
    }
  }

  async refund(paymentId: string, reason: string): Promise<void> {
    const record = this.escrows.get(paymentId)

    if (!record || record.status !== "held") {
      return
    }

    record.status = "refunded"
    this.escrows.set(paymentId, record)

    // Execute refund callback if registered
    const callback = this.refundCallbacks.get(paymentId)
    if (callback) {
      await callback(record)
    }

    console.log(`[Escrow] Refunded ${paymentId}: ${reason}`)
  }

  onRefund(paymentId: string, callback: (record: EscrowRecord) => Promise<void>): void {
    this.refundCallbacks.set(paymentId, callback)
  }

  getEscrow(paymentId: string): EscrowRecord | undefined {
    return this.escrows.get(paymentId)
  }
}
