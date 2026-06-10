/**
 * Exchange Rate Service
 *
 * Fuente del USD/ARS:
 *  - Si VITE_PANEL_API_URL está definido → Panel Admin (/exchange-rate).
 *  - Si no → fallback al Apps Script viejo (VITE_EXCHANGE_RATE_URL).
 * Ambos devuelven { rate }. El cambio de fuente es por env (cutover reversible).
 * El valor es solo informativo; los precios están fijos en USD.
 */

const PANEL_API_URL = import.meta.env.VITE_PANEL_API_URL || ''
const APPS_SCRIPT_URL = import.meta.env.VITE_EXCHANGE_RATE_URL || ''

// Fuente activa: el panel tiene prioridad si está configurado.
const SOURCE_URL = PANEL_API_URL
  ? `${PANEL_API_URL.replace(/\/$/, '')}/exchange-rate`
  : APPS_SCRIPT_URL

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
