/**
 * CRM webhook integration (GoHighLevel)
 *
 * Sends lead data to the CRM webhook configured in VITE_CRM_WEBHOOK_URL.
 * Fire-and-forget: doesn't wait for response, doesn't block the UI.
 *
 * Anti-spam:
 * - Honeypot field (if filled, skip send — bot detected)
 * - Rate limiting via localStorage (max 3 sends per 5 minutes)
 */

const WEBHOOK_URL = import.meta.env.VITE_CRM_WEBHOOK_URL ||
  'https://services.leadconnectorhq.com/hooks/hog2BhQzuZRWe1h85X5K/webhook-trigger/4c7ad3ff-eed4-4ddf-b04a-0167de7053f1'

const RATE_LIMIT_KEY = 'crm-webhook-sends'
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000

export interface CrmLead {
  nombre: string
  telefono: string
  modelo_actual: string
  almacenamiento_actual: string
  cotizacion_estimada: number
  modelo_canje?: string
  almacenamiento_canje?: string
  color_canje?: string
  precio_canje?: number
  honeypot?: string
}

// Patrones obvios de spam (números repetidos o secuencias)
const SPAM_PATTERNS: RegExp[] = [
  /^(\d)\1{9,}$/, // todos iguales: 1111111111
  /^0123456789$/, /^1234567890$/, /^9876543210$/, // secuencias
]

/**
 * Validates Argentine phone format and rejects obvious spam patterns.
 * Acepta 10-13 dígitos (con o sin prefijo 54/549/9).
 */
export function isValidArgPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-+()]/g, '')
  if (!/^\d{10,13}$/.test(cleaned)) return false

  // Validación de longitud y prefijo
  let lengthOk = false
  if (cleaned.length === 10) lengthOk = true
  if (cleaned.length === 11 && cleaned.startsWith('9')) lengthOk = true
  if (cleaned.length === 12 && cleaned.startsWith('54')) lengthOk = true
  if (cleaned.length === 13 && cleaned.startsWith('549')) lengthOk = true
  if (!lengthOk) return false

  // Rechazar patrones obvios de spam
  if (SPAM_PATTERNS.some(p => p.test(cleaned))) return false

  return true
}

/**
 * Returns true if the user has exceeded the rate limit.
 */
function isRateLimited(): boolean {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY)
    if (!raw) return false
    const sends: number[] = JSON.parse(raw)
    const cutoff = Date.now() - RATE_LIMIT_WINDOW_MS
    const recent = sends.filter(t => t > cutoff)
    return recent.length >= RATE_LIMIT_MAX
  } catch {
    return false
  }
}

function recordSend() {
  try {
    const raw = localStorage.getItem(RATE_LIMIT_KEY)
    const sends: number[] = raw ? JSON.parse(raw) : []
    const cutoff = Date.now() - RATE_LIMIT_WINDOW_MS
    const recent = sends.filter(t => t > cutoff)
    recent.push(Date.now())
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recent))
  } catch { /* ignore */ }
}

/**
 * Sends a lead to the CRM webhook. Fire-and-forget.
 * Returns true if the send was attempted, false if blocked (bot/rate limit).
 */
export async function sendLeadToCrm(lead: CrmLead): Promise<boolean> {
  // Honeypot: if filled, it's a bot, silently discard
  if (lead.honeypot && lead.honeypot.trim() !== '') {
    return false
  }

  // Rate limit check
  if (isRateLimited()) {
    return false
  }

  // Validate required fields
  if (!lead.nombre || !lead.telefono) {
    return false
  }
  if (!isValidArgPhone(lead.telefono)) {
    return false
  }

  // Strip honeypot before sending
  const { honeypot: _, ...payload } = lead

  recordSend()

  try {
    // Usamos no-cors para evitar bloqueo del browser por preflight CORS.
    // No podemos leer la respuesta pero el POST llega igual al CRM.
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(payload),
      keepalive: true,
    })
    return true
  } catch {
    return false
  }
}
