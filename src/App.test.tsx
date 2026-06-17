import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'

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
  it('renders the intro screen', () => {
    render(<App />)
    expect(screen.getByText(/Cambia tu/)).toBeInTheDocument()
    expect(screen.getByText('Cotizar mi iPhone')).toBeInTheDocument()
  })

  it('muestra la pantalla de elección del wizard al clickear "Cotizar mi iPhone"', async () => {
    render(<App />)
    fireEvent.click(screen.getByText('Cotizar mi iPhone'))
    expect(await screen.findByText('¿Qué querés hacer?')).toBeInTheDocument()
  })
})
