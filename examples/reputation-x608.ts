/**
 * Reputation System x608 Example
 * Track merchant reliability and trust scores
 */

import { ReputationManager } from "../src/x608/reputation"

async function reputationExample() {
  const manager = new ReputationManager()

  console.log("=== x608 Reputation System ===\n")

  // Simulate transactions with different merchants
  const merchants = {
    reliable: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    average: "0x8ba1f109551bD432803012645Ac136ddd64DBA72",
    unreliable: "0x1234567890123456789012345678901234567890",
  }

  // Reliable merchant: 100 successful transactions
  console.log("Recording transactions for reliable merchant...")
  for (let i = 0; i < 100; i++) {
    manager.recordTransaction(merchants.reliable, true, 150 + Math.random() * 50)
  }

  // Average merchant: 50 transactions, 5 refunds
  console.log("Recording transactions for average merchant...")
  for (let i = 0; i < 50; i++) {
    const refunded = i < 5
    manager.recordTransaction(merchants.average, !refunded, 200 + Math.random() * 100, refunded)
  }

  // Unreliable merchant: 20 transactions, 10 failures, 5 refunds
  console.log("Recording transactions for unreliable merchant...")
  for (let i = 0; i < 20; i++) {
    const success = i >= 10
    const refunded = i < 5
    manager.recordTransaction(merchants.unreliable, success, 300 + Math.random() * 200, refunded)
  }

  // Display reputation scores
  console.log("\n=== Reputation Scores ===\n")

  for (const [name, address] of Object.entries(merchants)) {
    const score = manager.getScore(address)
    const trust = manager.getTrustLevel(address)

    if (score) {
      console.log(`${name.toUpperCase()} (${address})`)
      console.log(`  Trust Level: ${trust.toUpperCase()}`)
      console.log(`  Total Transactions: ${score.totalTransactions}`)
      console.log(`  Successful: ${score.successfulTransactions}`)
      console.log(`  Refunds: ${score.refundCount}`)
      console.log(`  Uptime: ${score.uptimePercent}%`)
      console.log(`  Avg Response: ${score.averageResponseMs}ms`)
      console.log("")
    }
  }
}

reputationExample()
