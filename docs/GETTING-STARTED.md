# Getting Started with x502

## Installation

\`\`\`bash
npm install x502-protocol
\`\`\`

## Quick Start (5 minutes)

### 1. Server Setup

\`\`\`typescript
import express from 'express';
import { x502Middleware } from 'x502-protocol';

const app = express();

// Add x502 payment to any route
app.use('/api/premium', x502Middleware({
  priceUSD: 0.25,
  routes: ['base:USDC', 'sol:USDC'],
  settleAsset: 'base:USDC',
  recipientAddress: '0xYourAddress',
  escrowSeconds: 60,
}));

// Protected endpoint
app.get('/api/premium/data', (req, res) => {
  res.json({ secret: 'premium data' });
});

app.listen(3000);
\`\`\`

### 2. Client Setup

\`\`\`typescript
import { X502Client } from 'x502-protocol';

const client = new X502Client({
  wallet: myWallet, // ethers.js wallet
  preferredRoute: 'base:USDC',
});

// Automatically handles 402 challenges
const data = await client.fetch('http://localhost:3000/api/premium/data');
console.log(data);
\`\`\`

## Core Concepts

### Payment Routes

Routes define how users can pay:

\`\`\`typescript
routes: [
  'base:USDC',   // USDC on Base
  'sol:USDC',    // USDC on Solana
  'base:EUROC',  // EUROC on Base
  'tron:USDT',   // USDT on Tron
]
\`\`\`

### Escrow

Hold payments until content is verified:

\`\`\`typescript
escrowSeconds: 60  // Hold for 60 seconds
\`\`\`

Server provides content hash:
\`\`\`typescript
const hash = generateHash(content);
const challenge = await generator.generateChallenge(hash);
\`\`\`

### Streaming

Pay per unit of consumption:

\`\`\`typescript
{
  enableStreaming: true,
  streamUnit: 'kb',      // or 'token', 'call'
  streamRate: 0.001,     // $0.001 per KB
}
\`\`\`

### Policy Wallets

Control AI agent spending:

\`\`\`typescript
const wallet = new PolicyWallet({
  dailyCapUSD: 10.00,
  allowlist: ['api.openai.com'],
  requireApprovalAbove: 1.00,
});
\`\`\`

## Examples

### Basic Payment

\`\`\`typescript
// Server
app.use('/api/data', x502Middleware({
  priceUSD: 0.10,
  routes: ['base:USDC'],
  settleAsset: 'base:USDC',
  recipientAddress: '0xYourAddress',
}));

// Client
const response = await client.fetch('/api/data');
\`\`\`

### Multi-Currency

\`\`\`typescript
// Server accepts multiple currencies
app.use('/api/data', x502Middleware({
  priceUSD: 1.00,
  routes: ['base:USDC', 'sol:USDC', 'base:EUROC'],
  settleAsset: 'base:USDC',
  recipientAddress: '0xYourAddress',
}));

// Client pays with Solana USDC
const client = new X502Client({
  wallet: solanaWallet,
  preferredRoute: 'sol:USDC',
});
\`\`\`

### Streaming Video

\`\`\`typescript
// Server charges per KB
app.use('/api/video', x502Middleware({
  priceUSD: 5.00,
  routes: ['base:USDC'],
  settleAsset: 'base:USDC',
  recipientAddress: '0xYourAddress',
  enableStreaming: true,
  streamUnit: 'kb',
  streamRate: 0.001,
}));

// Client sets budget cap
const client = new X502Client({
  wallet: myWallet,
  budgetCap: 5.00,
});
\`\`\`

### AI Agent with Limits

\`\`\`typescript
// Create policy wallet
const agentWallet = new PolicyWallet({
  dailyCapUSD: 20.00,
  allowlist: [
    'api.openai.com',
    'api.anthropic.com',
  ],
  requireApprovalAbove: 2.00,
});

// Agent makes payments
const canPay = await agentWallet.canSpend(0.50, 'api.openai.com');
if (canPay) {
  agentWallet.recordSpending(0.50, 'api.openai.com');
  // Make API call
}
\`\`\`

## Testing

### Local Development

\`\`\`bash
# Run examples
npm run build
node dist/examples/basic-x402.js
node dist/examples/multi-currency-x502.js
node dist/examples/streaming-x502.js
\`\`\`

### Integration Tests

\`\`\`typescript
import { X502ChallengeGenerator } from 'x502-protocol';

describe('x502 payments', () => {
  it('generates valid challenge', async () => {
    const generator = new X502ChallengeGenerator(config);
    const challenge = await generator.generateChallenge();
    
    expect(challenge.challengeId).toMatch(/^x502_/);
    expect(challenge.routes.length).toBeGreaterThan(0);
  });
});
\`\`\`

## Next Steps

1. **Read the Protocol Spec** - [docs/PROTOCOL.md](./PROTOCOL.md)
2. **Compare with x402** - [docs/COMPARISON.md](./COMPARISON.md)
3. **Run Examples** - See `/examples` directory
4. **Deploy** - Use Vercel, Railway, or any Node.js host

## Support

- GitHub Issues: [github.com/yourrepo/x502-protocol](https://github.com)
- Documentation: [docs/](./docs/)
- Examples: [examples/](../examples/)
