/**
 * Streaming Payment x608 Example
 * Pay per KB for large file downloads
 */

import { StreamingPaymentManager } from "../src/x608/streaming"
import type { StreamConfig } from "../src/types/x608.types"

async function streamingExample() {
  const config: StreamConfig = {
    unit: "kb",
    ratePerUnit: 0.001, // $0.001 per KB
    budgetCap: 1.0, // $1.00 maximum
  }

  const manager = new StreamingPaymentManager()
  const session = manager.createSession("session_abc123", config)

  console.log("=== x608 Streaming Payment ===")
  console.log("Unit:", config.unit)
  console.log("Rate:", config.ratePerUnit, "USD per", config.unit)
  console.log("Budget Cap:", config.budgetCap, "USD")

  // Simulate streaming download
  console.log("\n=== Streaming Download ===")

  const chunks = [100, 250, 500, 300] // KB

  for (const chunk of chunks) {
    const result = session.recordUsage(chunk)

    if (result.allowed) {
      console.log(
        `✅ Downloaded ${chunk} KB - Cost: $${result.cost.toFixed(3)} - Remaining: $${result.remaining.toFixed(3)}`,
      )
    } else {
      console.log(`❌ Budget exceeded - Remaining: $${result.remaining.toFixed(3)}`)
      break
    }
  }

  const usage = session.getUsage()
  console.log("\n=== Final Usage ===")
  console.log("Total:", usage.units, "KB")
  console.log("Cost:", usage.cost.toFixed(3), "USD")
  console.log("Remaining:", usage.remaining.toFixed(3), "USD")
}

streamingExample()
