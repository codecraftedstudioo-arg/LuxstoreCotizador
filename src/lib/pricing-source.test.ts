import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

/**
 * El cotizador solo usa el panel embebido (/api/v1/cotizador-prices).
 * Si falla → panel-no-disponible (no cae a pricing.json).
 */

function mockFetch(calls: string[]) {
  return vi.fn(async (input: RequestInfo | URL) => {
    calls.push(String(input))
    return { ok: false, status: 500, json: async () => ({}) } as unknown as Response
  })
}

describe('initPricingConfig — panel embebido', () => {
  beforeEach(() => {
    vi.resetModules()
  })
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('si /api/v1/cotizador-prices falla → marca panel-no-disponible', async () => {
    const calls: string[] = []
    vi.stubGlobal('fetch', mockFetch(calls))

    const mod = await import('./pricing-source')
    await mod.initPricingConfig()

    expect(mod.isPanelPricingFailed()).toBe(true)
    expect(calls.some((u) => u.includes('/api/v1/cotizador-prices'))).toBe(true)
  })
})
