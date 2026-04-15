import { describe, it, expect } from 'vitest'
import { getAlternatives, shouldShowAlternatives, HIGH_DIFF_THRESHOLD_USD } from './alternatives'
import type { Model } from '@/types/market'

const mockMarket: Model[] = [
  {
    id: 'iphone-17-pro-max', name: 'iPhone 17 Pro Max', featured: true,
    variants: [
      { storage: '256', priceUSD: 1460, direction: 'up', color: 'Silver' },
      { storage: '512', priceUSD: 1670, direction: 'up', color: 'Orange' },
    ],
  },
  {
    id: 'iphone-17-pro', name: 'iPhone 17 Pro', featured: true,
    variants: [
      { storage: '256', priceUSD: 1310, direction: 'up', color: 'Orange' },
      { storage: '1024', priceUSD: 1750, direction: 'up', color: 'Blue' },
    ],
  },
  {
    id: 'iphone-17-air', name: 'iPhone 17 Air', featured: false,
    variants: [
      { storage: '256', priceUSD: 990, direction: 'same', color: 'Sky Blue' },
    ],
  },
  {
    id: 'iphone-17', name: 'iPhone 17', featured: false,
    variants: [
      { storage: '256', priceUSD: 880, direction: 'up', color: 'Black' },
    ],
  },
  {
    id: 'iphone-17e', name: 'iPhone 17e', featured: false,
    variants: [
      { storage: '256', priceUSD: 690, direction: 'same', color: 'Black' },
    ],
  },
  {
    id: 'iphone-16', name: 'iPhone 16', featured: false,
    variants: [
      { storage: '128', priceUSD: 760, direction: 'same', color: 'Teal' },
    ],
  },
  {
    id: 'iphone-15', name: 'iPhone 15', featured: false,
    variants: [
      { storage: '128', priceUSD: 650, direction: 'same', color: 'Blue' },
      { storage: '256', priceUSD: 0, direction: 'same', color: 'Green', inStock: false },
    ],
  },
]

describe('getAlternatives — recomendador', () => {
  it('sugiere modelos más baratos que el elegido', () => {
    // Cliente tiene iPhone 13, eligió 17 Pro Max
    const alts = getAlternatives({
      marketModels: mockMarket,
      currentModel: 'iPhone 13',
      selectedModel: 'iPhone 17 Pro Max',
      selectedPrice: 1460,
      tradeInValue: 200,
    })

    expect(alts.length).toBeGreaterThan(0)
    // Todas las alternativas deben ser más baratas
    alts.forEach(a => expect(a.price).toBeLessThan(1460))
  })

  it('ordena por diferencia a pagar ascendente', () => {
    const alts = getAlternatives({
      marketModels: mockMarket,
      currentModel: 'iPhone 13',
      selectedModel: 'iPhone 17 Pro Max',
      selectedPrice: 1460,
      tradeInValue: 200,
    })

    for (let i = 1; i < alts.length; i++) {
      expect(alts[i].newDiff).toBeGreaterThanOrEqual(alts[i - 1].newDiff)
    }
  })

  it('respeta el limit', () => {
    const alts = getAlternatives({
      marketModels: mockMarket,
      currentModel: 'iPhone 13',
      selectedModel: 'iPhone 17 Pro Max',
      selectedPrice: 1460,
      tradeInValue: 200,
      limit: 2,
    })
    expect(alts.length).toBeLessThanOrEqual(2)
  })

  it('no incluye modelos "e" (no son upgrade)', () => {
    const alts = getAlternatives({
      marketModels: mockMarket,
      currentModel: 'iPhone 13',
      selectedModel: 'iPhone 17 Pro Max',
      selectedPrice: 1460,
      tradeInValue: 200,
    })
    expect(alts.some(a => a.model.toLowerCase().includes('17e'))).toBe(false)
  })

  it('no incluye variantes sin stock', () => {
    const alts = getAlternatives({
      marketModels: mockMarket,
      currentModel: 'iPhone 13',
      selectedModel: 'iPhone 17 Pro Max',
      selectedPrice: 1460,
      tradeInValue: 200,
    })
    // iPhone 15 Green está sin stock, la alternativa para iPhone 15 debe ser la variante Blue (en stock)
    const iphone15 = alts.find(a => a.model === 'iPhone 15')
    if (iphone15) {
      expect(iphone15.color).toBe('Blue')
    }
  })

  it('no incluye downgrades', () => {
    // Cliente tiene iPhone 16 Pro, eligió 17 Pro Max (1460)
    const alts = getAlternatives({
      marketModels: mockMarket,
      currentModel: 'iPhone 16 Pro',
      selectedModel: 'iPhone 17 Pro Max',
      selectedPrice: 1460,
      tradeInValue: 500,
    })
    // No debería incluir iPhone 15, 16 base, 17 base, 17 Air — son downgrades o iguales
    const noDowngrades = ['iPhone 15', 'iPhone 16', 'iPhone 17', 'iPhone 17 Air']
    noDowngrades.forEach(m => {
      expect(alts.some(a => a.model === m)).toBe(false)
    })
  })

  it('incluye upgrades de misma generación con tier mayor', () => {
    // Cliente tiene iPhone 17 (base), eligió 17 Pro Max
    const alts = getAlternatives({
      marketModels: mockMarket,
      currentModel: 'iPhone 17',
      selectedModel: 'iPhone 17 Pro Max',
      selectedPrice: 1460,
      tradeInValue: 300,
    })
    // 17 Pro es upgrade respecto a 17 base (misma gen, tier mayor)
    expect(alts.some(a => a.model === 'iPhone 17 Pro')).toBe(true)
  })

  it('no sugiere el mismo modelo que eligió', () => {
    const alts = getAlternatives({
      marketModels: mockMarket,
      currentModel: 'iPhone 13',
      selectedModel: 'iPhone 17 Pro',
      selectedPrice: 1310,
      tradeInValue: 200,
    })
    expect(alts.some(a => a.model === 'iPhone 17 Pro')).toBe(false)
  })

  it('devuelve array vacío si no hay upgrades disponibles', () => {
    // Cliente tiene el mejor modelo posible
    const alts = getAlternatives({
      marketModels: mockMarket,
      currentModel: 'iPhone 17 Pro Max',
      selectedModel: 'iPhone 17 Pro Max',
      selectedPrice: 1460,
      tradeInValue: 1000,
    })
    expect(alts.length).toBe(0)
  })

  it('calcula newDiff correctamente', () => {
    const alts = getAlternatives({
      marketModels: mockMarket,
      currentModel: 'iPhone 13',
      selectedModel: 'iPhone 17 Pro Max',
      selectedPrice: 1460,
      tradeInValue: 200,
    })
    alts.forEach(a => {
      expect(a.newDiff).toBe(a.price - 200)
    })
  })
})

describe('shouldShowAlternatives', () => {
  it('true cuando diferencia supera el umbral', () => {
    expect(shouldShowAlternatives(HIGH_DIFF_THRESHOLD_USD)).toBe(true)
    expect(shouldShowAlternatives(HIGH_DIFF_THRESHOLD_USD + 100)).toBe(true)
  })

  it('false cuando diferencia es baja', () => {
    expect(shouldShowAlternatives(100)).toBe(false)
    expect(shouldShowAlternatives(HIGH_DIFF_THRESHOLD_USD - 1)).toBe(false)
  })
})
