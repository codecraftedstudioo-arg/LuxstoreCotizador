import type { WizardState, PriceResult } from '@/features/wizard/types'
import type { Language } from './i18n'
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

// Translations for WhatsApp message
const waTranslations = {
  es: {
    greeting: '¡Hola! Quiero vender mi iPhone.',
    name: 'Nombre:',
    phone: 'Teléfono:',
    model: 'Modelo:',
    storage: 'Almacenamiento:',
    battery: 'Batería:',
    batteryLow: 'Menor a 80%',
    batteryOk: '80% o más',
    screen: 'Pantalla:',
    screenPerfect: 'Perfecta',
    screenMinor: 'Rayones leves',
    screenCracked: 'Rajada/rota',
    issues: 'Problemas:',
    noIssues: 'Ninguno',
    faceId: 'Face ID',
    camera: 'Cámara',
    audio: 'Audio',
    parts: 'Piezas originales:',
    partsYes: 'Sí',
    partsNo: 'No',
    aesthetic: 'Estado estético:',
    aestheticPerfect: 'Impecable',
    aestheticMinor: 'Detalles leves',
    aestheticDamage: 'Golpes visibles',
    quote: 'Cotización:',
    coordinate: '¿Podemos coordinar?',
  },
  en: {
    greeting: 'Hi! I want to sell my iPhone.',
    name: 'Name:',
    phone: 'Phone:',
    model: 'Model:',
    storage: 'Storage:',
    battery: 'Battery:',
    batteryLow: 'Below 80%',
    batteryOk: '80% or more',
    screen: 'Screen:',
    screenPerfect: 'Perfect',
    screenMinor: 'Minor scratches',
    screenCracked: 'Cracked/broken',
    issues: 'Issues:',
    noIssues: 'None',
    faceId: 'Face ID',
    camera: 'Camera',
    audio: 'Audio',
    parts: 'Original parts:',
    partsYes: 'Yes',
    partsNo: 'No',
    aesthetic: 'Aesthetic condition:',
    aestheticPerfect: 'Pristine',
    aestheticMinor: 'Minor details',
    aestheticDamage: 'Visible damage',
    quote: 'Quote:',
    coordinate: 'Can we coordinate?',
  },
}

/**
 * Builds a WhatsApp message summarizing the phone condition
 */
export function buildMessage(
  state: WizardState,
  priceResult: PriceResult,
  contactInfo?: ContactInfo,
  lang: Language = 'es'
): string {
  const t = waTranslations[lang]
  const lines: string[] = []

  lines.push(t.greeting)
  lines.push('')

  // Contact info at the top if provided
  if (contactInfo?.name) {
    lines.push(`*${t.name}* ${contactInfo.name}`)
  }
  if (contactInfo?.phone) {
    lines.push(`*${t.phone}* ${contactInfo.phone}`)
  }
  if (contactInfo?.name || contactInfo?.phone) {
    lines.push('')
  }

  lines.push(`*${t.model}* ${state.model?.name}`)
  lines.push(`*${t.storage}* ${state.storage === '1024' ? '1 TB' : state.storage + ' GB'}`)
  lines.push(`*${t.battery}* ${state.batteryBelow80 ? t.batteryLow : t.batteryOk}`)

  // Pantalla
  const screenLabels = {
    perfect: t.screenPerfect,
    'minor-scratches': t.screenMinor,
    cracked: t.screenCracked,
  }
  lines.push(`*${t.screen}* ${screenLabels[state.screenCondition!]}`)

  // Funcionalidades
  const issues: string[] = []
  if (state.functionalityIssues.faceId) issues.push(t.faceId)
  if (state.functionalityIssues.camera) issues.push(t.camera)
  if (state.functionalityIssues.audio) issues.push(t.audio)
  lines.push(`*${t.issues}* ${issues.length > 0 ? issues.join(', ') : t.noIssues}`)

  // Piezas
  lines.push(`*${t.parts}* ${state.hasNonOriginalParts ? t.partsNo : t.partsYes}`)

  // Estado estético
  const aestheticLabels = {
    perfect: t.aestheticPerfect,
    'minor-details': t.aestheticMinor,
    'visible-damage': t.aestheticDamage,
  }
  lines.push(`*${t.aesthetic}* ${aestheticLabels[state.aestheticCondition!]}`)

  lines.push('')
  lines.push(`*${t.quote}* ${formatPrice(priceResult.finalPrice)}`)
  lines.push('')
  lines.push(t.coordinate)

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
  contactInfo?: ContactInfo,
  lang: Language = 'es'
): string {
  const message = buildMessage(state, priceResult, contactInfo, lang)
  const encodedMessage = encodeURIComponent(message)

  return `https://wa.me/${BUSINESS_PHONE}?text=${encodedMessage}`
}

