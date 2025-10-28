/**
 * Exchange rate utilities for multi-currency support
 */

interface ExchangeRates {
  [asset: string]: number
}

// Mock exchange rates - in production, fetch from Coinbase or other oracle
const MOCK_RATES: ExchangeRates = {
  "base:USDC": 1.0,
  "sol:USDC": 1.0,
  "base:EUROC": 1.08,
  "tron:USDT": 1.0,
  "base:ETH": 2500.0,
  "arb:USDC": 1.0,
  "op:USDC": 1.0,
}

export async function getExchangeRates(assets: string[]): Promise<ExchangeRates> {
  // In production, fetch real-time rates from Coinbase API or oracle
  const rates: ExchangeRates = {}

  for (const asset of assets) {
    rates[asset] = MOCK_RATES[asset] || 1.0
  }

  return rates
}

export function convertToUSD(amount: number, asset: string, rate: number): number {
  return amount * rate
}

export function convertFromUSD(amountUSD: number, asset: string, rate: number): number {
  return amountUSD / rate
}
