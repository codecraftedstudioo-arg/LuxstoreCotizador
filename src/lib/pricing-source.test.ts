import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

/**
 * Fallback del cotizador (decisión #1):
 *  - Si el panel es la fuente (post-cutover) y falla → NO se cotiza con la
 *    pricing.json vieja (precios desviados); se marca panel-no-disponible y la
 *    UI muestra "Cotización no disponible" en vez de un número.
 *  - Sin panel configurado (rollback del cutover) → la estática es fuente
 *    legítima, NO se marca falla.
 */

const PANEL = 'https://panel.example/api/v1'

function mockFetch(calls: string[]) {
  return vi.fn(async (input: RequestInfo | URL) => {
    calls.push(String(input))
    return { ok: false, status: 500, json: async () => ({}) } as unknown as Response
  })
}

describe('initPricingConfig — sin fallback a pricing.json viejo (decisión #1)', () => {
  beforeEach(() => {
    vi.resetModules()
  })
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('panel configurado y caído → marca panel-no-disponible', async () => {
    vi.stubEnv('VITE_PANEL_API_URL', PANEL)
    const calls: string[] = []
    vi.stubGlobal('fetch', mockFetch(calls))

    const mod = await import('./pricing-source')
    await mod.initPricingConfig()

    expect(mod.isPanelPricingFailed()).toBe(true)
    expect(calls.some((u) => u.includes('cotizador-prices'))).toBe(true)
  })

  it('sin panel (rollback) → NO marca falla (la estática es fuente legítima)', async () => {
    vi.stubEnv('VITE_PANEL_API_URL', '')
    vi.stubGlobal('fetch', mockFetch([]))

    const mod = await import('./pricing-source')
    await mod.initPricingConfig()

    expect(mod.isPanelPricingFailed()).toBe(false)
  })
})
