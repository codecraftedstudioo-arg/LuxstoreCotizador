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
    battery: 'Salud de batería:',
    batteryLow: 'Menor a 85%',
    batteryOk: '85% o más',
    screen: 'Pantalla:',
    screenPerfect: 'Perfecta',
    screenScratches: 'Rayones visibles',
    screenCracked: 'Rota/rajada',
    back: 'Tapa trasera:',
    backPerfect: 'Perfecta',
    backCracked: 'Rota/rajada',
    frame: 'Marco:',
    framePerfect: 'Perfecto',
    frameDamaged: 'Dañado',
    liquidDamage: 'Daño por líquido:',
    yes: 'Sí',
    no: 'No',
    issues: 'Problemas:',
    noIssues: 'Ninguno',
    faceId: 'Face ID',
    camera: 'Cámara',
    audio: 'Audio',
    charging: 'Carga',
    originalScreen: 'Pantalla original:',
    originalBattery: 'Batería original:',
    quote: 'Cotización:',
    coordinate: '¿Podemos coordinar?',
  },
  en: {
    greeting: 'Hi! I want to sell my iPhone.',
    name: 'Name:',
    phone: 'Phone:',
    model: 'Model:',
    storage: 'Storage:',
    battery: 'Battery health:',
    batteryLow: 'Below 85%',
    batteryOk: '85% or more',
    screen: 'Screen:',
    screenPerfect: 'Perfect',
    screenScratches: 'Visible scratches',
    screenCracked: 'Cracked/broken',
    back: 'Back glass:',
    backPerfect: 'Perfect',
    backCracked: 'Cracked/broken',
    frame: 'Frame:',
    framePerfect: 'Perfect',
    frameDamaged: 'Damaged',
    liquidDamage: 'Liquid damage:',
    yes: 'Yes',
    no: 'No',
    issues: 'Issues:',
    noIssues: 'None',
    faceId: 'Face ID',
    camera: 'Camera',
    audio: 'Audio',
    charging: 'Charging',
    originalScreen: 'Original screen:',
    originalBattery: 'Original battery:',
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
  lang: Language = 'es',
  exchangeRate: number = 0
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

  // Model and storage
  lines.push(`*${t.model}* ${state.model}`)
  lines.push(`*${t.storage}* ${state.storage === '1024' ? '1 TB' : state.storage + ' GB'}`)

  // Battery health
  lines.push(`*${t.battery}* ${state.batteryHealth === 'low' ? t.batteryLow : t.batteryOk}`)

  // Screen condition
  const screenLabels = {
    perfect: t.screenPerfect,
    scratches: t.screenScratches,
    cracked: t.screenCracked,
  }
  if (state.screenCondition) {
    lines.push(`*${t.screen}* ${screenLabels[state.screenCondition]}`)
  }

  // Back condition
  const backLabels = {
    perfect: t.backPerfect,
    cracked: t.backCracked,
  }
  if (state.backCondition) {
    lines.push(`*${t.back}* ${backLabels[state.backCondition]}`)
  }

  // Frame condition
  const frameLabels = {
    perfect: t.framePerfect,
    damaged: t.frameDamaged,
  }
  if (state.frameCondition) {
    lines.push(`*${t.frame}* ${frameLabels[state.frameCondition]}`)
  }

  // Liquid damage
  if (state.hasLiquidDamage !== null) {
    lines.push(`*${t.liquidDamage}* ${state.hasLiquidDamage ? t.yes : t.no}`)
  }

  // Functionality issues
  const issues: string[] = []
  if (state.functionalityIssues.faceId) issues.push(t.faceId)
  if (state.functionalityIssues.camera) issues.push(t.camera)
  if (state.functionalityIssues.audio) issues.push(t.audio)
  if (state.functionalityIssues.charging) issues.push(t.charging)
  lines.push(`*${t.issues}* ${issues.length > 0 ? issues.join(', ') : t.noIssues}`)

  // Original parts
  lines.push(`*${t.originalScreen}* ${state.originalParts.screen ? t.yes : t.no}`)
  lines.push(`*${t.originalBattery}* ${state.originalParts.battery ? t.yes : t.no}`)

  lines.push('')
  lines.push(`*${t.quote}* ${formatPrice(priceResult.finalPrice)}`)
  if (exchangeRate > 0) {
    const arsEquivalent = (priceResult.finalPrice * exchangeRate).toLocaleString('es-AR')
    lines.push(lang === 'es'
      ? `Equivale a $${arsEquivalent} ARS (dólar $${exchangeRate.toLocaleString('es-AR')})`
      : `Equivalent to $${arsEquivalent} ARS (rate $${exchangeRate.toLocaleString('en-US')})`)
  }
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
  lang: Language = 'es',
  exchangeRate: number = 0
): string {
  const message = buildMessage(state, priceResult, contactInfo, lang, exchangeRate)
  const encodedMessage = encodeURIComponent(message)

  return `https://wa.me/${BUSINESS_PHONE}?text=${encodedMessage}`
}
