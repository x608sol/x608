/**
 * x608 Idempotency Manager
 * Prevents double-charging on retries
 */

import type { X608Payment } from "../types/x608.types"

interface IdempotencyRecord {
  key: string
  payment: X608Payment
  createdAt: number
  expiresAt: number
}

export class IdempotencyManager {
  private records: Map<string, IdempotencyRecord> = new Map()
  private readonly ttlMs: number

  constructor(ttlSeconds = 3600) {
    this.ttlMs = ttlSeconds * 1000

    // Cleanup expired records every 5 minutes
    setInterval(() => this.cleanup(), 300000)
  }

  recordPayment(idempotencyKey: string, payment: X608Payment): void {
    const now = Date.now()

    this.records.set(idempotencyKey, {
      key: idempotencyKey,
      payment,
      createdAt: now,
      expiresAt: now + this.ttlMs,
    })
  }

  getPayment(idempotencyKey: string): X608Payment | null {
    const record = this.records.get(idempotencyKey)

    if (!record) {
      return null
    }

    if (Date.now() > record.expiresAt) {
      this.records.delete(idempotencyKey)
      return null
    }

    return record.payment
  }

  hasPayment(idempotencyKey: string): boolean {
    return this.getPayment(idempotencyKey) !== null
  }

  private cleanup(): void {
    const now = Date.now()

    for (const [key, record] of this.records.entries()) {
      if (now > record.expiresAt) {
        this.records.delete(key)
      }
    }
  }

  clear(): void {
    this.records.clear()
  }
}
