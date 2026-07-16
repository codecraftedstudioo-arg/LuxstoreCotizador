import type { MarketPricing, Model, Variant } from '@/types/market'

const APPS_SCRIPT_URL = import.meta.env.VITE_MARKET_PRICES_URL || ''
const CACHE_DURATION_MS = 5 * 60 * 1000

let cachedData: MarketPricing | null = null
let cacheTimestamp = 0
let inflight: Promise<MarketPricing> | null = null

// --- Transform helpers (tests): items planos → models agrupados ---

type PanelMarketItem = {
  model: string
  featured?: boolean
  color: string
  storage: string
  priceUsd: number
  stock: number
  direction?: 'up' | 'down' | 'same'
  priceDiff?: number
}

function slugifyModel(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function transformPanelToMarket(items: PanelMarketItem[]): MarketPricing {
  const byModel = new Map<string, { name: string; featured: boolean; variants: Variant[] }>()

  for (const it of items) {
    let m = byModel.get(it.model)
    if (!m) {
      m = { name: it.model, featured: !!it.featured, variants: [] }
      byModel.set(it.model, m)
    }
    m.variants.push({
      storage: it.storage,
      color: it.color,
      priceUSD: it.priceUsd,
      // El panel manda la flecha desde el último cambio de precio. Si no viene
      // (ítem sin historial), queda 'same' → sin flecha.
      direction: it.direction ?? 'same',
      priceDiff: it.priceDiff ?? 0,
      inStock: it.stock > 0,
    })
  }

  const models: Model[] = Array.from(byModel.values()).map((m) => ({
    id: slugifyModel(m.name),
    name: m.name,
    featured: m.featured,
    variants: m.variants,
  }))

  // El cotizador no usa accesorios (no están en su type MarketPricing).
  return {
    models,
    currency: 'USD',
    lastUpdated: new Date().toISOString().slice(0, 10),
  }
}

async function fetchFromAppsScript(): Promise<MarketPricing> {
  if (!APPS_SCRIPT_URL) {
    throw new Error('VITE_MARKET_PRICES_URL not configured')
  }
  const url = `${APPS_SCRIPT_URL}${APPS_SCRIPT_URL.includes('?') ? '&' : '?'}t=${Date.now()}`
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)

  const data: MarketPricing = await response.json()
  if (!data.models || !Array.isArray(data.models) || data.models.length === 0) {
    throw new Error('Invalid data format')
  }
  return data
}

export async function fetchMarketPrices(): Promise<MarketPricing> {
  if (cachedData && Date.now() - cacheTimestamp < CACHE_DURATION_MS) {
    return cachedData
  }

  if (inflight) return inflight

  if (!APPS_SCRIPT_URL) {
    throw new Error('Sin fuente de precios de market configurada')
  }

  inflight = (async () => {
    try {
      const data = await fetchFromAppsScript()
      cachedData = data
      cacheTimestamp = Date.now()
      return data
    } finally {
      inflight = null
    }
  })()

  return inflight
}
