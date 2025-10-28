# x402 vs x502 Comparison

## Feature Matrix

| Feature | x402 | x502 | Benefit |
|---------|------|------|---------|
| **Single Currency** | ✅ USDC only | ✅ Any asset | More flexibility |
| **Multi-Currency** | ❌ | ✅ Multiple routes | User choice, better UX |
| **Chain Support** | Base only | Base, Solana, Tron, Arbitrum, Optimism, Ethereum | Wider reach |
| **Escrow Safety** | ❌ | ✅ 30-120s hold | Fraud protection |
| **Content Verification** | ❌ | ✅ SHA-256 hash | Data integrity |
| **Auto-Refunds** | ❌ | ✅ On mismatch | User protection |
| **Idempotency** | ❌ | ✅ Unique keys | No double-charge |
| **Retry Safety** | Manual | Automatic | Better reliability |
| **Streaming Payments** | ❌ | ✅ Per KB/token/call | Granular pricing |
| **Budget Caps** | ❌ | ✅ Client-side limits | Cost control |
| **Policy Wallets** | ❌ | ✅ Caps, allowlists | Agent safety |
| **Approval Flows** | ❌ | ✅ For large payments | Human oversight |
| **Private Receipts** | ❌ | ✅ ZK proofs | Privacy |
| **Reputation System** | ❌ | ✅ Trust scores | Merchant quality |
| **Uptime Tracking** | ❌ | ✅ Reliability metrics | Service quality |
| **Developer UX** | Basic | Drop-in middleware | Faster integration |
| **Offline Support** | ❌ | ✅ QR vouchers | Retail use cases |

## Use Case Comparison

### x402 Best For:
- Simple USDC payments on Base
- Single-chain applications
- Minimal integration requirements
- Coinbase-native apps

### x502 Best For:
- Multi-chain applications
- AI agents with spending limits
- High-value transactions needing escrow
- Streaming content (video, AI, data)
- Enterprise with compliance needs
- Apps requiring payment flexibility
- Services needing reputation tracking

## Code Comparison

### x402 Challenge

\`\`\`typescript
// x402: Single currency, basic challenge
{
  challengeId: "x402_abc123",
  priceUSD: 0.25,
  asset: "base:USDC",
  recipientAddress: "0x742d35...",
  chainId: 8453
}
\`\`\`

### x502 Challenge

\`\`\`typescript
// x502: Multi-currency, escrow, streaming
{
  challengeId: "x502_abc123",
  priceUSD: 0.25,
  routes: [
    { asset: "base:USDC", rate: 1.0 },
    { asset: "sol:USDC", rate: 1.0 },
    { asset: "base:EUROC", rate: 1.08 }
  ],
  settleAsset: "base:USDC",
  contentHash: "sha256-3baf...",
  escrowSeconds: 60,
  idempotencyKey: "ik_xyz789",
  mode: "stream",
  streamConfig: {
    unit: "kb",
    ratePerUnit: 0.001,
    budgetCap: 1.00
  }
}
\`\`\`

## Performance

| Metric | x402 | x502 | Notes |
|--------|------|------|-------|
| Challenge Generation | ~5ms | ~15ms | x502 fetches exchange rates |
| Payment Verification | ~100ms | ~150ms | x502 checks escrow + idempotency |
| Memory Overhead | Minimal | +2-5MB | For escrow + reputation tracking |
| Network Requests | 1 | 1-2 | x502 may fetch rates |

## Migration Path

### Phase 1: Add x502 Alongside x402
\`\`\`typescript
// Support both protocols
app.use('/api/v1', x402Middleware(config));
app.use('/api/v2', x502Middleware(config));
\`\`\`

### Phase 2: Gradual Migration
\`\`\`typescript
// Detect client capability
if (req.headers['x-502-support']) {
  return x502Middleware(config);
} else {
  return x402Middleware(config);
}
\`\`\`

### Phase 3: Full x502
\`\`\`typescript
// x502 only (backward compatible)
app.use(x502Middleware({
  ...config,
  routes: ['base:USDC'], // Single route = x402 compatible
}));
\`\`\`

## When to Use Each

### Use x402 When:
- ✅ Building on Base only
- ✅ USDC is sufficient
- ✅ Simple payment flow
- ✅ Minimal dependencies
- ✅ Coinbase ecosystem only

### Use x502 When:
- ✅ Need multi-chain support
- ✅ Want payment flexibility
- ✅ Require escrow safety
- ✅ Building AI agents
- ✅ Streaming content/data
- ✅ Need reputation tracking
- ✅ Enterprise compliance
- ✅ High-value transactions

## Conclusion

**x402** is perfect for simple, Base-native USDC payments.

**x502** is the evolution for production apps needing flexibility, safety, and advanced features.

Both protocols can coexist, and x502 is backward compatible with x402 when configured with a single route.
