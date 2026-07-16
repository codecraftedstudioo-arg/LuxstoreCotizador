/**
 * Validación de teléfonos argentinos (formato local / con prefijo).
 */

// Patrones obvios de spam (número completo o últimos 10 dígitos locales)
const SPAM_PATTERNS: RegExp[] = [
  /^(\d)\1{9,}$/, // todos iguales: 1111111111
  /^0123456789$/, /^1234567890$/, /^9876543210$/, // secuencias
  /0123456789$/, /1234567890$/, /9876543210$/, // secuencias al final (con prefijo 549)
]

/**
 * Detecta números con muy poca variedad (ej: 1212121212).
 * Si solo hay 2 o menos dígitos únicos, es sospechoso de spam.
 */
function hasLowDigitVariety(localDigits: string): boolean {
  const unique = new Set(localDigits)
  return unique.size <= 2
}

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

  // Obtener los últimos 10 dígitos locales (área + número) y validar variedad
  const localDigits = cleaned.slice(-10)
  if (hasLowDigitVariety(localDigits)) return false

  return true
}
