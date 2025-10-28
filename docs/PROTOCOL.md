# x502 Protocol Specification

## Overview

x502 is an enhanced HTTP 402 payment protocol that extends Coinbase's x402 with multi-currency support, escrow safety, streaming payments, and agent-friendly features.

## Protocol Flow

### 1. Client Request

\`\`\`http
GET /api/premium/data HTTP/1.1
Host: api.example.com
\`\`\`

### 2. Server Challenge (402 Response)

\`\`\`http
HTTP/1.1 402 Payment Required
X-502-Challenge: x502_a1b2c3d4e5f6
X-502-Price-USD: 0.25
X-502-Routes: ["base:USDC","sol:USDC","base:EUROC","tron:USDT"]
X-502-Settle: base:USDC
X-502-Hash: sha256-3baf...9c
X-502-Escrow: 60s
X-502-Idempotency-Key: ik_7a8b9c0d
X-502-Mode: single
X-502-Quote-Ref: oracle:coinbase-spot:USDC,EUROC,USDT

{
  "error": "Payment Required",
  "challenge": "x502_a1b2c3d4e5f6",
  "routes": ["base:USDC", "sol:USDC", "base:EUROC", "tron:USDT"],
  "priceUSD": 0.25
}
\`\`\`

### 3. Client Payment

Client selects a payment route and submits transaction:

\`\`\`http
GET /api/premium/data HTTP/1.1
Host: api.example.com
X-502-Payment: {"challengeId":"x502_a1b2c3d4e5f6","txHash":"0xabc...","route":"base:USDC","idempotencyKey":"ik_7a8b9c0d"}
\`\`\`

### 4. Server Verification & Response

\`\`\`http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Integrity: sha256-3baf...9c

{
  "data": "premium content"
}
\`\`\`

## Headers Reference

### Challenge Headers (Server → Client)

| Header | Required | Description |
|--------|----------|-------------|
| `X-502-Challenge` | Yes | Unique challenge identifier |
| `X-502-Price-USD` | Yes | Price in USD |
| `X-502-Routes` | Yes | JSON array of payment routes |
| `X-502-Settle` | Yes | Asset merchant settles in |
| `X-502-Idempotency-Key` | Yes | Key for retry safety |
| `X-502-Hash` | No | Content hash for verification |
| `X-502-Escrow` | No | Escrow duration (e.g., "60s") |
| `X-502-Mode` | No | "single" or "stream" |
| `X-502-Quote-Ref` | No | Exchange rate sources |

### Payment Headers (Client → Server)

| Header | Required | Description |
|--------|----------|-------------|
| `X-502-Payment` | Yes | JSON payment proof |

## Payment Routes

Routes follow the format: `{chain}:{asset}`

### Supported Chains

- `base` - Base (Coinbase L2)
- `sol` - Solana
- `tron` - Tron
- `arb` - Arbitrum
- `op` - Optimism
- `eth` - Ethereum mainnet

### Supported Assets

- `USDC` - USD Coin
- `USDT` - Tether
- `EUROC` - Euro Coin
- `ETH` - Ether (for high-value payments)

## Features

### Multi-Currency

Server advertises multiple payment routes. Client chooses one. Facilitator swaps to merchant's settlement asset if needed.

### Escrow

Payments held for verification period (default 60s). Auto-refund if content hash doesn't match.

### Idempotency

Each challenge has unique idempotency key. Retries never double-charge.

### Streaming

Pay per unit (KB, token, API call) with budget caps:

\`\`\`http
X-502-Mode: stream; cap=1.00
X-502-Unit: kb
X-502-Rate: 0.001
\`\`\`

### Policy Wallets

AI agents can have:
- Daily spending caps
- Domain allowlists/blocklists
- Approval requirements for large payments
- Team budgets

### Reputation

Track merchant metrics:
- Total transactions
- Success rate
- Refund rate
- Average response time
- Uptime percentage

## Error Codes

| Code | Meaning |
|------|---------|
| 402 | Payment Required |
| 400 | Invalid Payment |
| 409 | Duplicate Payment (idempotency) |
| 429 | Budget Exceeded |
| 403 | Merchant Not Allowed (policy) |

## Security Considerations

1. **Always verify on-chain** - Don't trust payment headers without blockchain verification
2. **Use escrow for high-value** - Protect against content mismatch
3. **Implement rate limiting** - Prevent challenge spam
4. **Validate content hashes** - Ensure data integrity
5. **Monitor reputation** - Track merchant reliability

## Migration from x402

x502 is backward compatible with x402. To migrate:

1. Keep existing x402 implementation
2. Add multi-currency routes
3. Enable escrow for content verification
4. Add idempotency keys
5. Optionally enable streaming and policy features

## Examples

See `/examples` directory for:
- Basic x402 usage
- Multi-currency x502
- Streaming payments
- Policy wallets
- Reputation tracking
