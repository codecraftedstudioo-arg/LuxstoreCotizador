import { useEffect, useState } from 'react'
import { setEngineConfig, buildConfigFromPanel } from './pricing-engine'

/**
 * Fuente de los precios/penalizaciones del cotizador.
 * Siempre el panel embebido de este proyecto: GET /api/v1/cotizador-prices
 * (administrable en /admin). Si falla → cotización no disponible.
 */

const COTIZADOR_PRICES_URL = '/api/v1/cotizador-prices'

let readyPromise: Promise<void> | null = null
let panelFailed = false

/** True si el panel embebido no se pudo cargar. */
export function isPanelPricingFailed(): boolean {
  return panelFailed
}

/** Inicializa la config (idempotente: solo corre una vez). */
export function initPricingConfig(): Promise<void> {
  if (readyPromise) return readyPromise

  readyPromise = (async () => {
    try {
      const res = await fetch(COTIZADOR_PRICES_URL, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      if (
        !data ||
        !Array.isArray(data.models) ||
        data.models.length === 0 ||
        !Array.isArray(data.penalties) ||
        data.penalties.length === 0
      ) {
        throw new Error('Datos del panel inválidos')
      }

      setEngineConfig(buildConfigFromPanel(data))
    } catch (err) {
      panelFailed = true
      console.warn('[pricing] panel embebido caído — cotización no disponible:', err)
    }
  })()

  return readyPromise
}

/** Hook: true cuando la config terminó de cargar. */
export function usePricingReady(): boolean {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let alive = true
    initPricingConfig().then(() => {
      if (alive) setReady(true)
    })
    return () => {
      alive = false
    }
  }, [])
  return ready
}
