/**
 * x608 Policy Wallet
 * Budget caps, allowlists, and approval flows for AI agents
 */

import type { PolicyWalletConfig } from "../types/x608.types"

interface SpendingRecord {
  timestamp: number
  amount: number
  merchant: string
  approved: boolean
}

export class PolicyWallet {
  private config: PolicyWalletConfig
  private dailySpending: SpendingRecord[] = []
  private pendingApprovals: Map<string, (approved: boolean) => void> = new Map()

  constructor(config: PolicyWalletConfig) {
    this.config = config
  }

  async canSpend(amount: number, merchantDomain: string): Promise<boolean> {
    // Check allowlist/blocklist
    if (this.config.allowlist && !this.config.allowlist.includes(merchantDomain)) {
      console.log(`[PolicyWallet] Merchant ${merchantDomain} not in allowlist`)
      return false
    }

    if (this.config.blocklist?.includes(merchantDomain)) {
      console.log(`[PolicyWallet] Merchant ${merchantDomain} is blocked`)
      return false
    }

    // Check daily cap
    const todaySpending = this.getTodaySpending()
    if (todaySpending + amount > this.config.dailyCapUSD) {
      console.log(`[PolicyWallet] Daily cap exceeded: ${todaySpending + amount} > ${this.config.dailyCapUSD}`)
      return false
    }

    // Check if approval required
    if (this.config.requireApprovalAbove && amount > this.config.requireApprovalAbove) {
      return await this.requestApproval(amount, merchantDomain)
    }

    return true
  }

  recordSpending(amount: number, merchant: string, approved = true): void {
    this.dailySpending.push({
      timestamp: Date.now(),
      amount,
      merchant,
      approved,
    })

    // Notify webhook if configured
    if (this.config.notificationWebhook) {
      this.notifyWebhook(amount, merchant)
    }
  }

  private getTodaySpending(): number {
    const oneDayAgo = Date.now() - 86400000

    return this.dailySpending
      .filter((record) => record.timestamp > oneDayAgo && record.approved)
      .reduce((sum, record) => sum + record.amount, 0)
  }

  private async requestApproval(amount: number, merchant: string): Promise<boolean> {
    console.log(`[PolicyWallet] Approval required for $${amount} to ${merchant}`)

    // In production, this would trigger a notification and wait for user response
    // For now, we'll simulate with a promise
    return new Promise((resolve) => {
      const approvalId = `${Date.now()}-${merchant}`
      this.pendingApprovals.set(approvalId, resolve)

      // Auto-reject after 5 minutes
      setTimeout(() => {
        if (this.pendingApprovals.has(approvalId)) {
          this.pendingApprovals.delete(approvalId)
          resolve(false)
        }
      }, 300000)
    })
  }

  approvePayment(approvalId: string): void {
    const callback = this.pendingApprovals.get(approvalId)
    if (callback) {
      callback(true)
      this.pendingApprovals.delete(approvalId)
    }
  }

  rejectPayment(approvalId: string): void {
    const callback = this.pendingApprovals.get(approvalId)
    if (callback) {
      callback(false)
      this.pendingApprovals.delete(approvalId)
    }
  }

  private async notifyWebhook(amount: number, merchant: string): Promise<void> {
    if (!this.config.notificationWebhook) return

    try {
      await fetch(this.config.notificationWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "payment",
          amount,
          merchant,
          timestamp: Date.now(),
        }),
      })
    } catch (error) {
      console.error("[PolicyWallet] Webhook notification failed:", error)
    }
  }

  getSpendingHistory(): SpendingRecord[] {
    return [...this.dailySpending]
  }

  getRemainingBudget(): number {
    return Math.max(0, this.config.dailyCapUSD - this.getTodaySpending())
  }
}
