import type { WizardState, PriceResult } from '@/features/wizard/types'
import { formatPrice } from './pricing-engine'

// Número de WhatsApp del negocio (sin +, sin espacios)
// Formato Argentina: 54 + 9 + código área + número
const BUSINESS_PHONE = '5491140949046'

/**
 * Optional contact info from the user
 */
export interface ContactInfo {
  name?: string
  phone?: string
}

/**
 * Builds a WhatsApp message summarizing the phone condition
 */
function buildMessage(
  state: WizardState,
  priceResult: PriceResult,
  contactInfo?: ContactInfo
): string {
  const lines: string[] = []

  lines.push('¡Hola! Quiero vender mi iPhone.')
  lines.push('')

  // Contact info at the top if provided
  if (contactInfo?.name) {
    lines.push(`*Nombre:* ${contactInfo.name}`)
  }
  if (contactInfo?.phone) {
    lines.push(`*Teléfono:* ${contactInfo.phone}`)
  }
  if (contactInfo?.name || contactInfo?.phone) {
    lines.push('')
  }

  lines.push(`*Modelo:* ${state.model?.name}`)
  lines.push(`*Almacenamiento:* ${state.storage === '1024' ? '1 TB' : state.storage + ' GB'}`)
  lines.push(`*Batería:* ${state.batteryBelow80 ? 'Menor a 80%' : '80% o más'}`)

  // Pantalla
  const screenLabels = {
    perfect: 'Perfecta',
    'minor-scratches': 'Rayones leves',
    cracked: 'Rajada/rota',
  }
  lines.push(`*Pantalla:* ${screenLabels[state.screenCondition!]}`)

  // Funcionalidades
  const issues: string[] = []
  if (state.functionalityIssues.faceId) issues.push('Face ID')
  if (state.functionalityIssues.camera) issues.push('Cámara')
  if (state.functionalityIssues.audio) issues.push('Audio')
  lines.push(`*Problemas:* ${issues.length > 0 ? issues.join(', ') : 'Ninguno'}`)

  // Piezas
  lines.push(`*Piezas originales:* ${state.hasNonOriginalParts ? 'No' : 'Sí'}`)

  // Estado estético
  const aestheticLabels = {
    perfect: 'Impecable',
    'minor-details': 'Detalles leves',
    'visible-damage': 'Golpes visibles',
  }
  lines.push(`*Estado estético:* ${aestheticLabels[state.aestheticCondition!]}`)

  lines.push('')
  lines.push(`*Cotización:* ${formatPrice(priceResult.finalPrice)}`)
  lines.push('')
  lines.push('¿Podemos coordinar?')

  return lines.join('\n')
}

/**
 * Generates wa.me link with pre-filled message
 *
 * @example
 * buildWhatsAppLink(state, result, { name: 'Juan', phone: '1155667788' })
 * // Returns: "https://wa.me/5491140949046?text=Hola%20quiero%20vender..."
 */
export function buildWhatsAppLink(
  state: WizardState,
  priceResult: PriceResult,
  contactInfo?: ContactInfo
): string {
  const message = buildMessage(state, priceResult, contactInfo)
  const encodedMessage = encodeURIComponent(message)

  return `https://wa.me/${BUSINESS_PHONE}?text=${encodedMessage}`
}

