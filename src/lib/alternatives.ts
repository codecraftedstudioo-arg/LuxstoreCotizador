import type { Model } from '@/types/market'

/**
 * Genera recomendaciones de iPhones alternativos al que eligió el cliente en Plan Canje.
 *
 * Objetivo: cuando la diferencia a pagar es alta, sugerir otros modelos del market
 * que sigan siendo un upgrade respecto al iPhone del cliente pero con menor diferencia.
 */

export interface Alternative {
  model: string
  storage: string
  color: string
  price: number
  newDiff: number
}

// Jerarquía de modelos: mayor número = más nuevo/mejor.
// Dentro de una generación, el tier define la variante (base < Plus/Air < Pro < Pro Max).
interface ModelInfo {
  generation: number // 13, 14, 15, 16, 17
  tier: number       // 0=e, 1=base, 2=Plus/Air, 3=Pro, 4=Pro Max
}

function parseModelInfo(name: string): ModelInfo | null {
  const match = name.match(/iPhone (\d{2})\s*(mini|e|Plus|Air|Pro Max|Pro)?/i)
  if (!match) return null
  const generation = parseInt(match[1], 10)
  const variant = (match[2] ?? '').toLowerCase().trim()

  let tier: number
  switch (variant) {
    case 'mini': tier = 0; break
    case 'e': tier = 0; break
    case '': tier = 1; break // base
    case 'plus':
    case 'air': tier = 2; break
    case 'pro': tier = 3; break
    case 'pro max': tier = 4; break
    default: tier = 1
  }

  return { generation, tier }
}

/**
 * ¿El modelo candidato es un upgrade respecto al que tiene el cliente?
 * Upgrade = generación mayor, O misma generación pero tier mayor.
 * No consideramos upgrades los modelos "e" (iPhone 16e, 17e).
 */
function isUpgradeFrom(currentName: string, candidateName: string): boolean {
  const current = parseModelInfo(currentName)
  const candidate = parseModelInfo(candidateName)
  if (!current || !candidate) return false

  // Modelo "e" nunca es upgrade
  if (candidateName.toLowerCase().includes(' e') || /iPhone \d+e/i.test(candidateName)) {
    return false
  }

  // Mismo o mayor tier; si generación mayor pero tier menor, NO es upgrade verdadero
  if (candidate.generation > current.generation && candidate.tier >= current.tier) return true
  if (candidate.generation === current.generation && candidate.tier > current.tier) return true
  return false
}

/**
 * Devuelve hasta N alternativas al modelo elegido:
 * - Upgrade respecto al modelo actual del cliente
 * - Precio < precio del modelo elegido actualmente
 * - Variante en stock
 * - Ordenadas por diferencia a pagar ascendente
 */
export function getAlternatives({
  marketModels,
  currentModel,
  selectedModel,
  selectedPrice,
  tradeInValue,
  limit = 3,
}: {
  marketModels: Model[]
  currentModel: string
  selectedModel: string
  selectedPrice: number
  tradeInValue: number
  limit?: number
}): Alternative[] {
  const results: Alternative[] = []

  for (const m of marketModels) {
    // Skip el modelo que ya eligió
    if (m.name === selectedModel) continue
    // Solo modelos que sean upgrade respecto al que tiene
    if (!isUpgradeFrom(currentModel, m.name)) continue

    // Encontrar la variante más barata disponible en stock
    const inStockVariants = m.variants.filter(v => v.inStock !== false && v.priceUSD > 0)
    if (inStockVariants.length === 0) continue

    const cheapest = inStockVariants.reduce((min, v) =>
      v.priceUSD < min.priceUSD ? v : min
    )

    // Solo si es más barato que el elegido
    if (cheapest.priceUSD >= selectedPrice) continue

    results.push({
      model: m.name,
      storage: cheapest.storage,
      color: cheapest.color ?? '',
      price: cheapest.priceUSD,
      newDiff: cheapest.priceUSD - tradeInValue,
    })
  }

  // Ordenar por diferencia a pagar ascendente (más baratas primero)
  results.sort((a, b) => a.newDiff - b.newDiff)

  return results.slice(0, limit)
}

/**
 * Umbral (en USD) a partir del cual mostramos alternativas.
 * Si la diferencia a pagar es mayor o igual a esto, el recomendador aparece.
 */
export const HIGH_DIFF_THRESHOLD_USD = 800

export function shouldShowAlternatives(diffUSD: number): boolean {
  return diffUSD >= HIGH_DIFF_THRESHOLD_USD
}
