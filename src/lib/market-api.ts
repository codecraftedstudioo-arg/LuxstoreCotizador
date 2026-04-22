import type { MarketPricing } from '@/types/market'

const APPS_SCRIPT_URL = import.meta.env.VITE_MARKET_PRICES_URL || ''
const CACHE_DURATION_MS = 5 * 60 * 1000

let cachedData: MarketPricing | null = null
let cacheTimestamp = 0
let inflight: Promise<MarketPricing> | null = null

export async function fetchMarketPrices(): Promise<MarketPricing> {
  if (cachedData && Date.now() - cacheTimestamp < CACHE_DURATION_MS) {
    return cachedData
  }

  if (inflight) return inflight

  if (!APPS_SCRIPT_URL) {
    throw new Error('VITE_MARKET_PRICES_URL not configured')
  }

  inflight = (async () => {
    try {
      const url = `${APPS_SCRIPT_URL}${APPS_SCRIPT_URL.includes('?') ? '&' : '?'}t=${Date.now()}`
      const response = await fetch(url, { cache: 'no-store' })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      const data: MarketPricing = await response.json()
      if (!data.models || !Array.isArray(data.models) || data.models.length === 0) {
        throw new Error('Invalid data format')
      }

      cachedData = data
      cacheTimestamp = Date.now()
      return data
    } finally {
      inflight = null
    }
  })()

  return inflight
}
