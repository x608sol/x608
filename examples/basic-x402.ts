/**
 * Basic x402 Example
 * Simple USDC payment for API access
 */

import { X402ChallengeGenerator } from "../src/x402/challenge"
import type { X402Config } from "../src/types/x402.types"

async function basicX402Example() {
  // Configure x402 payment
  const config: X402Config = {
    priceUSD: 0.25,
    asset: "base:USDC",
    recipientAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    chainId: 8453, // Base
    expirySeconds: 300,
  }

  // Generate challenge
  const generator = new X402ChallengeGenerator(config)
  const challenge = generator.generateChallenge()
  const headers = generator.generateHeaders(challenge)

  console.log("=== x402 Challenge ===")
  console.log("Challenge ID:", challenge.challengeId)
  console.log("Price:", challenge.priceUSD, "USD")
  console.log("Asset:", challenge.asset)
  console.log("Recipient:", challenge.recipientAddress)
  console.log("\nHTTP Headers:")
  console.log(headers)

  // Simulate payment
  console.log("\n=== Simulated Payment ===")
  console.log("User pays 0.25 USDC on Base to recipient address")
  console.log("Transaction hash: 0xabc123...")

  // In production, verify the transaction on-chain
  console.log("\n✅ Payment verified, access granted")
}

basicX402Example()
