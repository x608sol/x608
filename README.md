# x608 Protocol

2v7eYhLSz5dzZroMBf69twJzwtkxKXBwPFmnMG8Xpump

An enhanced HTTP 402 payment protocol built on top of Coinbase's x402 system, adding multi-currency support, escrow safety, streaming payments, and agent-friendly features.

## What is x402?

x402 is Coinbase's "stablecoin payments over HTTP" protocol, using the HTTP 402 Payment Required status code to enable seamless crypto payments for API access, content, and services.

## What is x608?

x608 is an enhanced version of x402 that adds:

- **Multi-currency routes** - Accept USDC, USDT, EUROC, ETH across multiple chains
- **Safe escrow** - Hold funds with content hash verification and auto-refunds
- **Idempotent retries** - Never double-charge on network failures
- **Streaming pricing** - Pay per KB, per token, or per API call with budget caps
- **Private receipts** - Cryptographic payment proofs without wallet exposure
- **Policy wallets** - Daily caps, domain allowlists, and team budgets for AI agents
- **Reputation system** - Uptime, refund rates, and trust scores
- **Developer-first** - Drop-in middleware for Next.js, Express, FastAPI

## Installation

\`\`\`bash
npm install x608-protocol
\`\`\`

## Quick Start

### Server (Express)

\`\`\`typescript
import { x608Middleware } from 'x608-protocol';

app.use('/api/premium', x608Middleware({
  priceUSD: 0.25,
  routes: ['base:USDC', 'sol:USDC', 'base:EUROC'],
  settleAsset: 'base:USDC',
  escrowSeconds: 60
}));

app.get('/api/premium/data', (req, res) => {
  res.json({ data: 'premium content' });
});
\`\`\`

### Client

\`\`\`typescript
import { X608Client } from 'x608-protocol';

const client = new X608Client({
  wallet: myWallet,
  preferredRoute: 'base:USDC'
});

const response = await client.fetch('https://api.example.com/premium/data');
\`\`\`

## Features

### Multi-Currency Support

\`\`\`typescript
// Server advertises multiple payment routes
X-608-Routes: ["base:USDC","sol:USDC","base:EUROC","tron:USDT","base:ETH"]
X-608-Settle: "base:USDC"
\`\`\`

### Escrow & Content Verification

\`\`\`typescript
// Server provides content hash
X-608-Hash: sha256-3baf...9c
X-608-Escrow: 60s

// Auto-refund if content doesn't match
\`\`\`

### Streaming Payments

\`\`\`typescript
// Pay per KB or per token
X-608-Mode: stream; cap=1.00
X-608-Unit: kb
X-608-Rate: 0.001
\`\`\`

### Policy Wallets for AI Agents

\`\`\`typescript
const policyWallet = new PolicyWallet({
  dailyCap: 10.00,
  allowlist: ['api.openai.com', 'api.anthropic.com'],
  requireApproval: (amount) => amount > 1.00
});
\`\`\`

## Repository Structure

\`\`\`
/src
  /x402          - Original x402 implementation
  /x608          - Enhanced x608 implementation
  /types         - TypeScript definitions
  /utils         - Shared utilities
  /middleware    - Framework integrations
/examples        - Usage examples
/docs            - Documentation
\`\`\`

## Protocol Comparison

| Feature | x402 | x608 |
|---------|------|------|
| Single currency | ✅ | ✅ |
| Multi-currency | ❌ | ✅ |
| Escrow safety | ❌ | ✅ |
| Idempotency | ❌ | ✅ |
| Streaming | ❌ | ✅ |
| Policy wallets | ❌ | ✅ |
| Reputation | ❌ | ✅ |
| Private receipts | ❌ | ✅ |

## License

MIT

## Contributing

Contributions welcome! This is an open protocol implementation.
