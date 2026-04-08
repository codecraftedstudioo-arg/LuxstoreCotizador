export type PriceDirection = 'up' | 'down' | 'same'

export interface Variant {
  storage: string
  priceUSD: number
  direction: PriceDirection
  priceDiff?: number
  color?: string
  inStock?: boolean
}

export interface Model {
  id: string
  name: string
  featured: boolean
  variants: Variant[]
}

export interface MarketPricing {
  models: Model[]
  currency: string
  lastUpdated: string
}
