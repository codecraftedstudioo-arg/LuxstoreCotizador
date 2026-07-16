import type { WizardState, PriceResult, PricingConfig } from '@/features/wizard/types'
import pricingData from '@/config/pricing.json'

/**
 * Pricing Engine - calculates iPhone price based on condition
 *
 * Estructura: precios fijos por modelo+capacidad. Penalizaciones que pueden ser
 * un % del precio o un monto fijo en USD, con override opcional por modelo.
 * La fuente puede ser el pricing.json estático (default) o el Panel Admin
 * (cuando se inicializa con setEngineConfig). iCloud locked = sin cotización.
 */

// --- Config interna del motor (rica: type/value + overrides por modelo) ---

export type PenaltyValue = { type: 'percentage' | 'fixed_usd'; value: number }

type EnginePenalty = PenaltyValue & {
  // overrides indexados por NOMBRE de modelo (ej. "iPhone 16")
  overrides: Record<string, PenaltyValue>
}

export type EngineConfig = {
  prices: { model: string; storage: string; price: number }[]
  penalties: Record<string, EnginePenalty>
}

// Penalizaciones que en el pricing.json viejo son monto fijo USD (no %).
const STATIC_FIXED_KEYS = new Set(['noOriginalBox'])

/** Construye la config del motor desde el pricing.json estático. */
export function buildConfigFromStatic(data: PricingConfig): EngineConfig {
  const penalties: Record<string, EnginePenalty> = {}
  for (const [key, value] of Object.entries(data.deductions)) {
    penalties[key] = {
      type: STATIC_FIXED_KEYS.has(key) ? 'fixed_usd' : 'percentage',
      value: value as number,
      overrides: {},
    }
  }
  return { prices: data.prices, penalties }
}

// Shape que devuelve /api/v1/cotizador-prices
type PanelApiData = {
  models: {
    id: number
    name: string
    brand?: string
    year?: number
    sortOrder?: number
    active?: boolean
    prices: { storage: string; priceUsd: number }[]
  }[]
  penalties: {
    key: string
    type: 'percentage' | 'fixed_usd'
    value: number
    overrides?: Record<string, { type: 'percentage' | 'fixed_usd'; value: number }>
  }[]
}

/** Construye la config del motor desde la respuesta del Panel Admin. */
export function buildConfigFromPanel(data: PanelApiData): EngineConfig {
  // Todos los modelos sirven para mapear overrides por id → nombre
  const idToName = new Map(data.models.map((m) => [String(m.id), m.name]))

  // Solo activos, ordenados — define el orden del cotizador
  const activeModels = [...data.models]
    .filter((m) => m.active !== false)
    .sort((a, b) => (a.sortOrder ?? a.id) - (b.sortOrder ?? b.id) || a.id - b.id)

  const prices = activeModels.flatMap((m) =>
    m.prices.map((p) => ({ model: m.name, storage: p.storage, price: p.priceUsd }))
  )

  const penalties: Record<string, EnginePenalty> = {}
  for (const p of data.penalties) {
    const overrides: Record<string, PenaltyValue> = {}
    for (const [modelId, val] of Object.entries(p.overrides ?? {})) {
      const name = idToName.get(modelId)
      if (name) overrides[name] = { type: val.type, value: val.value }
    }
    penalties[p.key] = { type: p.type, value: p.value, overrides }
  }
  return { prices, penalties }
}

// Config activa: arranca con la estática (comportamiento actual garantizado).
let activeConfig: EngineConfig = buildConfigFromStatic(
  pricingData as unknown as PricingConfig
)

/** Reemplaza la config activa (ej. con la del panel). Reversible. */
export function setEngineConfig(cfg: EngineConfig): void {
  activeConfig = cfg
}

/** Resuelve la penalización para un modelo: override si existe, si no el global. */
function resolvePenalty(key: string, model: string | null): PenaltyValue {
  const pen = activeConfig.penalties[key]
  if (!pen) return { type: 'percentage', value: 0 }
  if (model && pen.overrides[model]) return pen.overrides[model]
  return { type: pen.type, value: pen.value }
}

export function calculatePrice(state: WizardState): PriceResult | null {
  if (!state.model || !state.storage) {
    return null
  }

  // iCloud bloqueado
  if (state.iCloudOff === false) {
    return {
      basePrice: 0,
      totalDeductions: 0,
      finalPrice: 0,
      deductionBreakdown: [],
      blocked: true,
      blockedReason: 'iCloudBlocked',
    }
  }

  const priceEntry = activeConfig.prices.find(
    (p) => p.model === state.model && p.storage === state.storage
  )
  if (!priceEntry) {
    return null
  }

  const basePrice = priceEntry.price
  const deductionBreakdown: PriceResult['deductionBreakdown'] = []

  // Empuja una penalización resuelta (% o USD fijo) al breakdown.
  const apply = (reason: string, key: string) => {
    const r = resolvePenalty(key, state.model)
    deductionBreakdown.push({
      reason,
      percentage: r.type === 'percentage' ? r.value : 0,
      amount: r.type === 'fixed_usd' ? r.value : 0,
    })
  }

  // Pantalla
  if (state.screenCondition === 'cracked') {
    apply('deductScreenCracked', 'screenCracked')
  } else if (state.screenCondition === 'scratches') {
    apply('deductScreenScratches', 'screenScratches')
  }

  // Tapa
  if (state.backCondition === 'cracked') {
    apply('deductBackCracked', 'backCracked')
  }

  // Marco
  if (state.frameCondition === 'damaged') {
    apply('deductFrameDamaged', 'frameDamaged')
  }

  // Líquido
  if (state.hasLiquidDamage) {
    apply('deductLiquidDamage', 'liquidDamage')
  }

  // Batería salud
  if (state.batteryHealth === 'low') {
    apply('deductBatteryLow', 'batteryBelow85')
  }

  // Partes originales - batería
  if (state.originalParts.battery === false) {
    apply('deductBatteryNotOriginal', 'batteryNotOriginal')
  }

  // Partes originales - pantalla
  if (state.originalParts.screen === false) {
    apply('deductScreenNotOriginal', 'screenNotOriginal')
  }

  // Funcionalidad
  if (state.functionalityIssues.faceId) {
    apply('deductFaceId', 'faceIdNotWorking')
  }
  if (state.functionalityIssues.camera) {
    apply('deductCamera', 'cameraNotWorking')
  }
  if (state.functionalityIssues.audio) {
    apply('deductAudio', 'audioNotWorking')
  }
  if (state.functionalityIssues.charging) {
    apply('deductCharging', 'chargingNotWorking')
  }

  // Sin caja original
  if (state.hasOriginalBox === false) {
    apply('deductNoOriginalBox', 'noOriginalBox')
  }

  // --- Totales ---
  const totalDeductionPercentage = deductionBreakdown.reduce(
    (sum, d) => sum + d.percentage,
    0
  )

  const roundTo5 = (n: number) => Math.round(n / 5) * 5

  // Monto por cada penalización porcentual (display)
  deductionBreakdown.forEach((d) => {
    if (d.percentage > 0) {
      d.amount = roundTo5(basePrice * d.percentage)
    }
  })

  // Suma de penalizaciones fijas (amount ya seteado, percentage = 0)
  const fixedDeductions = deductionBreakdown
    .filter((d) => d.percentage === 0 && d.amount > 0)
    .reduce((sum, d) => sum + d.amount, 0)

  const totalDeductionAmount =
    roundTo5(basePrice * totalDeductionPercentage) + fixedDeductions
  const finalPrice = Math.max(0, roundTo5(basePrice - totalDeductionAmount))

  return {
    basePrice,
    totalDeductions: totalDeductionPercentage,
    finalPrice,
    deductionBreakdown,
  }
}

/** Modelos disponibles (activos, en orden de precios del panel). */
export function getAvailableModels(): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  for (const p of activeConfig.prices) {
    if (!seen.has(p.model)) {
      seen.add(p.model)
      out.push(p.model)
    }
  }
  return out
}

/** Capacidades disponibles para un modelo. */
export function getStorageForModel(model: string): string[] {
  return activeConfig.prices
    .filter((p) => p.model === model)
    .map((p) => p.storage)
}

/** Formatea como USD. */
export function formatPrice(price: number): string {
  return `USD ${price.toLocaleString('es-AR')}`
}

/** Formatea capacidad ("256" → "256 GB", "1024" → "1 TB"). */
export function formatStorage(storage: string): string {
  const num = parseInt(storage)
  if (num >= 1024) return `${num / 1024} TB`
  return `${storage} GB`
}
