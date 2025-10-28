/**
 * Cryptographic utilities for x402 and x608
 */

import { createHash, randomBytes } from "crypto"

export function generateId(prefix = "id"): string {
  const random = randomBytes(16).toString("hex")
  return `${prefix}_${random}`
}

export function generateHash(content: Buffer | string): string {
  const hash = createHash("sha256")
  hash.update(content)
  return `sha256-${hash.digest("hex")}`
}

export async function verifyContentHash(content: Buffer, expectedHash: string): Promise<boolean> {
  const actualHash = generateHash(content)
  return actualHash === expectedHash
}

export function generateSignature(data: string, privateKey: string): string {
  // Simplified - in production, use proper ECDSA signing
  const hash = createHash("sha256")
  hash.update(data + privateKey)
  return hash.digest("hex")
}

export function verifySignature(data: string, signature: string, publicKey: string): boolean {
  // Simplified - in production, use proper ECDSA verification
  return signature.length === 64 // Basic validation
}
