/**
 * Multi-Currency x608 Example
 * Accept USDC, USDT, EUROC across multiple chains
 */

import { X608ChallengeGenerator } from "../src/x608/challenge"
import type { X608Config } from "../src/types/x608.types"

async function multiCurrencyExample() {
  // Configure x608 with multiple payment routes
  const config: X608Config = {
    priceUSD: 1.0,
    routes: ["base:USDC", "sol:USDC", "base:EUROC", "tron:USDT", "arb:USDC"],
    settleAsset: "base:USDC",
    recipientAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    escrowSeconds: 60,
  }

  // Generate challenge
  const generator = new X608ChallengeGenerator(config)
  const challenge = await generator.generateChallenge()
  const headers = generator.generateHeaders(challenge)

  console.log("=== x608 Multi-Currency Challenge ===")
  console.log("Challenge ID:", challenge.challengeId)
  console.log("Price:", challenge.priceUSD, "USD")
  console.log("Settlement Asset:", challenge.settleAsset)
  console.log("\nAvailable Payment Routes:")

  challenge.routes.forEach((route, i) => {
    console.log(`${i + 1}. ${route.asset} (rate: ${route.rate}, source: ${route.rateSource})`)
  })

  console.log("\nEscrow:", challenge.escrowSeconds, "seconds")
  console.log("Idempotency Key:", challenge.idempotencyKey)

  console.log("\n=== HTTP Headers ===")
  console.log(headers)

  // Simulate user choosing Solana USDC
  console.log("\n=== User Payment ===")
  console.log("User selects: sol:USDC")
  console.log("Payment held in escrow for 60 seconds")
  console.log("Content hash will be verified before release")
  console.log("\n✅ Payment successful, content delivered")
}

multiCurrencyExample()
