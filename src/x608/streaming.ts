/**
 * x608 Streaming Payments
 * Pay per KB, per token, or per API call with budget caps
 */

import type { StreamConfig } from "../types/x608.types"

export class StreamingPaymentManager {
  private sessions: Map<string, StreamSession> = new Map()

  createSession(sessionId: string, config: StreamConfig): StreamSession {
    const session = new StreamSession(sessionId, config)
    this.sessions.set(sessionId, session)
    return session
  }

  getSession(sessionId: string): StreamSession | null {
    return this.sessions.get(sessionId) || null
  }

  closeSession(sessionId: string): void {
    this.sessions.delete(sessionId)
  }
}

export class StreamSession {
  public readonly sessionId: string
  public readonly config: StreamConfig
  private usage = 0
  private totalCost = 0
  private active = true

  constructor(sessionId: string, config: StreamConfig) {
    this.sessionId = sessionId
    this.config = config
  }

  recordUsage(units: number): { allowed: boolean; cost: number; remaining: number } {
    if (!this.active) {
      return { allowed: false, cost: 0, remaining: 0 }
    }

    const cost = units * this.config.ratePerUnit
    const newTotal = this.totalCost + cost

    if (newTotal > this.config.budgetCap) {
      this.active = false
      return {
        allowed: false,
        cost: 0,
        remaining: Math.max(0, this.config.budgetCap - this.totalCost),
      }
    }

    this.usage += units
    this.totalCost = newTotal

    return {
      allowed: true,
      cost,
      remaining: this.config.budgetCap - newTotal,
    }
  }

  getUsage(): { units: number; cost: number; remaining: number } {
    return {
      units: this.usage,
      cost: this.totalCost,
      remaining: Math.max(0, this.config.budgetCap - this.totalCost),
    }
  }

  isActive(): boolean {
    return this.active && this.totalCost < this.config.budgetCap
  }

  close(): void {
    this.active = false
  }
}
