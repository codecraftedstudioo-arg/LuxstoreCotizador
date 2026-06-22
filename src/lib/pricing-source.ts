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
// Decisión #1: si el panel es la fuente (post-cutover) y falla, NO cotizamos con
// la pricing.json vieja (precios desviados) → marcamos "no disponible" y la UI
// corta en vez de mostrar un número viejo.
let panelFailed = false

/** True si el panel era la fuente configurada pero no se pudo cargar. */
export function isPanelPricingFailed(): boolean {
  return panelFailed
}

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
      // El panel era la fuente y falló: NO usamos la pricing.json vieja para
      // cotizar (precios desviados). Marcamos no-disponible → la UI corta. (Decisión #1.)
      panelFailed = true
      console.warn('[pricing] panel caído — cotización no disponible:', err)
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
