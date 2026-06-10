import { useEffect, useState } from 'react'
import { setEngineConfig, buildConfigFromPanel } from './pricing-engine'

/**
 * Fuente de los precios/penalizaciones del cotizador.
 *  - Si VITE_PANEL_API_URL está definido → los trae del Panel Admin.
 *  - Si falla (red, datos inválidos) o el flag está vacío → el motor se queda
 *    con la config estática (pricing.json) que ya tiene por default.
 * Cutover reversible y a prueba de caídas.
 */

const PANEL_API_URL = import.meta.env.VITE_PANEL_API_URL || ''

let readyPromise: Promise<void> | null = null

/** Inicializa la config (idempotente: solo corre una vez). */
export function initPricingConfig(): Promise<void> {
  if (readyPromise) return readyPromise

  readyPromise = (async () => {
    if (!PANEL_API_URL) return // flag off → queda la estática

    try {
      const url = `${PANEL_API_URL.replace(/\/$/, '')}/cotizador-prices`
      const res = await fetch(url, { cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      // Validación de cordura: si los datos no vienen bien, no pisamos nada.
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
      // Fallback: el motor ya tiene la config estática → no se rompe nada.
      console.warn('[pricing] usando fallback estático (pricing.json):', err)
    }
  })()

  return readyPromise
}

/** Hook: true cuando la config terminó de cargar (panel o fallback). */
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
