/**
 * x608 Reputation System
 * Track merchant uptime, refund rates, and trust scores
 */

import type { ReputationScore } from "../types/x608.types"

interface TransactionRecord {
  merchantAddress: string
  success: boolean
  refunded: boolean
  responseTimeMs: number
  timestamp: number
}

export class ReputationManager {
  private scores: Map<string, ReputationScore> = new Map()
  private transactions: TransactionRecord[] = []

  recordTransaction(merchantAddress: string, success: boolean, responseTimeMs: number, refunded = false): void {
    this.transactions.push({
      merchantAddress,
      success,
      refunded,
      responseTimeMs,
      timestamp: Date.now(),
    })

    this.updateScore(merchantAddress)
  }

  private updateScore(merchantAddress: string): void {
    const merchantTxs = this.transactions.filter((tx) => tx.merchantAddress === merchantAddress)

    if (merchantTxs.length === 0) return

    const totalTransactions = merchantTxs.length
    const successfulTransactions = merchantTxs.filter((tx) => tx.success).length
    const refundCount = merchantTxs.filter((tx) => tx.refunded).length

    const avgResponseMs = merchantTxs.reduce((sum, tx) => sum + tx.responseTimeMs, 0) / totalTransactions
    const uptimePercent = (successfulTransactions / totalTransactions) * 100

    const score: ReputationScore = {
      merchantAddress,
      totalTransactions,
      successfulTransactions,
      refundCount,
      averageResponseMs: Math.round(avgResponseMs),
      uptimePercent: Math.round(uptimePercent * 100) / 100,
      lastUpdated: Date.now(),
    }

    this.scores.set(merchantAddress, score)
  }

  getScore(merchantAddress: string): ReputationScore | null {
    return this.scores.get(merchantAddress) || null
  }

  getAllScores(): ReputationScore[] {
    return Array.from(this.scores.values())
  }

  getTrustLevel(merchantAddress: string): "high" | "medium" | "low" | "unknown" {
    const score = this.getScore(merchantAddress)

    if (!score || score.totalTransactions < 10) {
      return "unknown"
    }

    if (score.uptimePercent >= 99 && score.refundCount / score.totalTransactions < 0.01) {
      return "high"
    }

    if (score.uptimePercent >= 95 && score.refundCount / score.totalTransactions < 0.05) {
      return "medium"
    }

    return "low"
  }

  exportScores(): string {
    const scores = this.getAllScores()
    return JSON.stringify(scores, null, 2)
  }
}
