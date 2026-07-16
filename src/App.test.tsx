import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// El wizard se bloquea en "Cargando precios…" hasta que la config (panel o fallback)
// resuelve, y App dispara fetchExchangeRate/fetchMarketPrices/initPricingConfig al
// importarse. En el test forzamos pricing listo y stubbeamos esos fetch para no
// pegarle a la red ni dejar timers de retry colgados (lo que volvía el test frágil).
vi.mock('@/lib/pricing-source', () => ({
  usePricingReady: () => true,
  isPanelPricingFailed: () => false,
  initPricingConfig: () => Promise.resolve(),
}))
vi.mock('@/lib/exchange-rate', () => ({
  fetchExchangeRate: () => Promise.resolve(1400),
}))
vi.mock('@/lib/market-api', () => ({
  fetchMarketPrices: () => Promise.resolve({ models: [], currency: 'USD', lastUpdated: '' }),
}))

// Import after the mocks so App's module-level effects use them.
const { default: App } = await import('./App')

describe('App', () => {
  it('inicia directamente en el cotizador', () => {
    render(<App />)
    expect(screen.getByText('¿Qué querés hacer?')).toBeInTheDocument()
  })
})
