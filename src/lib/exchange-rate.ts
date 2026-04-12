/**
 * Exchange Rate Service
 *
 * Fetches USD/ARS rate from a private Google Sheet via Apps Script.
 * The rate is only used for display purposes (informational).
 * Prices are fixed in USD.
 */

const APPS_SCRIPT_URL = import.meta.env.VITE_EXCHANGE_RATE_URL || ''

export const FALLBACK_RATE = 1500

// Cache: 5 minutes
const CACHE_DURATION_MS = 5 * 60 * 1000

let cachedRate: number | null = null
let cacheTimestamp = 0

/**
 * Fetch the current USD/ARS exchange rate (display only)
 */
export async function fetchExchangeRate(): Promise<number> {
  if (cachedRate !== null && Date.now() - cacheTimestamp < CACHE_DURATION_MS) {
    return cachedRate
  }

  if (!APPS_SCRIPT_URL) {
    return FALLBACK_RATE
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)

    const data = await response.json()
    const rate = Number(data.rate)

    if (!rate || rate <= 0) throw new Error('Invalid rate')

    cachedRate = rate
    cacheTimestamp = Date.now()
    return rate
  } catch {
    return cachedRate ?? FALLBACK_RATE
  }
}
