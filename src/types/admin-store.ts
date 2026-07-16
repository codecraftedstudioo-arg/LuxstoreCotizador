/**
 * Shared shape of /api/v1/cotizador-prices (Panel Admin contract).
 */

export type PenaltyType = 'percentage' | 'fixed_usd'

export type PenaltyOverride = { type: PenaltyType; value: number }

export type PanelPenalty = {
  key: string
  label: string
  category: string
  type: PenaltyType
  value: number
  overrides?: Record<string, PenaltyOverride>
}

export type PanelModel = {
  id: number
  name: string
  brand: string
  year?: number
  /** Lower = aparece primero en el cotizador */
  sortOrder: number
  /** false = oculto en el cotizador (se conserva en el store) */
  active: boolean
  prices: { storage: string; priceUsd: number }[]
}

export type CotizadorConfig = {
  currency: string
  batteryThreshold: number
  lastUpdated: string
}

export type CotizadorStore = {
  models: PanelModel[]
  penalties: PanelPenalty[]
  config: CotizadorConfig
}
