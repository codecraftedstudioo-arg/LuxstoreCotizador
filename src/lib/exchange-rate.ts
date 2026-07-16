/**
 * Exchange Rate Service
 *
 * Fuente del USD/ARS: VITE_EXCHANGE_RATE_URL (Google Apps Script u another endpoint).
 * Devuelve { rate }. El valor es solo informativo; los precios están fijos en USD.
 */

const SOURCE_URL = import.meta.env.VITE_EXCHANGE_RATE_URL || ''

// Cache: 5 minutes
const CACHE_DURATION_MS = 5 * 60 * 1000

let cachedRate: number | null = null
let cacheTimestamp = 0

/**
 * Fetch the current USD/ARS exchange rate (display only).
 * Returns null if no real rate is available.
 */
export async function fetchExchangeRate(): Promise<number | null> {
  if (cachedRate !== null && Date.now() - cacheTimestamp < CACHE_DURATION_MS) {
    return cachedRate
  }

  if (!SOURCE_URL) {
    return cachedRate
  }

  try {
    const response = await fetch(SOURCE_URL)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = await response.json()
    const rate = Number(data.rate)

    if (!rate || rate <= 0) throw new Error('Invalid rate')

    cachedRate = rate
    cacheTimestamp = Date.now()
    return rate
  } catch {
    return cachedRate
  }
}
