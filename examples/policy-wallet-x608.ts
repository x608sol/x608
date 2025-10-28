/**
 * Policy Wallet x608 Example
 * AI agent with spending limits and allowlists
 */

import { PolicyWallet } from "../src/x608/policy-wallet"
import type { PolicyWalletConfig } from "../src/types/x608.types"

async function policyWalletExample() {
  // Configure policy wallet for AI agent
  const config: PolicyWalletConfig = {
    dailyCapUSD: 10.0,
    allowlist: ["api.openai.com", "api.anthropic.com", "api.perplexity.ai"],
    requireApprovalAbove: 1.0,
  }

  const wallet = new PolicyWallet(config)

  console.log("=== x608 Policy Wallet for AI Agent ===")
  console.log("Daily Cap:", config.dailyCapUSD, "USD")
  console.log("Allowlist:", config.allowlist.join(", "))
  console.log("Approval Required Above:", config.requireApprovalAbove, "USD")

  // Simulate AI agent making payments
  console.log("\n=== AI Agent Payments ===")

  const payments = [
    { amount: 0.25, merchant: "api.openai.com" },
    { amount: 0.5, merchant: "api.anthropic.com" },
    { amount: 0.75, merchant: "api.openai.com" },
    { amount: 1.5, merchant: "api.perplexity.ai" }, // Requires approval
    { amount: 0.3, merchant: "api.unknown.com" }, // Not in allowlist
  ]

  for (const payment of payments) {
    const allowed = await wallet.canSpend(payment.amount, payment.merchant)

    if (allowed) {
      wallet.recordSpending(payment.amount, payment.merchant)
      console.log(`✅ $${payment.amount} to ${payment.merchant} - Approved`)
    } else {
      console.log(`❌ $${payment.amount} to ${payment.merchant} - Denied`)
    }
  }

  console.log("\n=== Budget Summary ===")
  console.log("Remaining Budget:", wallet.getRemainingBudget().toFixed(2), "USD")

  const history = wallet.getSpendingHistory()
  const totalSpent = history.filter((r) => r.approved).reduce((sum, r) => sum + r.amount, 0)

  console.log("Total Spent:", totalSpent.toFixed(2), "USD")
}

policyWalletExample()
