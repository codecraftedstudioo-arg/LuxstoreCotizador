import type { WizardState, PriceResult, PricingConfig } from '@/features/wizard/types'
import pricingData from '@/config/pricing.json'

// Type assertion - le decimos a TS que el JSON tiene la forma de PricingConfig
const config = pricingData as unknown as PricingConfig

/**
 * Pricing Engine - calculates iPhone price based on condition
 *
 * Formula:
 * finalPrice = basePrice × storageMultiplier × (1 - totalDeductions)
 *
 * This is a pure function - same input = same output (easy to test)
 */
export function calculatePrice(state: WizardState): PriceResult | null {
  // Validar que tengamos todos los datos necesarios
  if (!state.model || !state.storage) {
    return null
  }

  const { model, storage, batteryBelow80, screenCondition, functionalityIssues, hasNonOriginalParts, aestheticCondition } = state
  const deductions = config.deductions

  // 1. Precio base del modelo
  const basePrice = model.basePrice

  // 2. Multiplicador por almacenamiento
  const storageMultiplier = config.storageMultipliers[storage]

  // 3. Calcular deducciones
  const deductionBreakdown: PriceResult['deductionBreakdown'] = []

  // Batería
  if (batteryBelow80) {
    deductionBreakdown.push({
      reason: 'deductBattery',
      percentage: deductions.batteryBelow80,
      amount: 0, // Se calcula después
    })
  }

  // Pantalla
  if (screenCondition === 'minor-scratches') {
    deductionBreakdown.push({
      reason: 'deductScreenMinor',
      percentage: deductions.screenMinorScratches,
      amount: 0,
    })
  } else if (screenCondition === 'cracked') {
    deductionBreakdown.push({
      reason: 'deductScreenCracked',
      percentage: deductions.screenCracked,
      amount: 0,
    })
  }

  // Funcionalidades
  if (functionalityIssues.faceId) {
    deductionBreakdown.push({
      reason: 'deductFaceId',
      percentage: deductions.faceIdNotWorking,
      amount: 0,
    })
  }

  if (functionalityIssues.camera) {
    deductionBreakdown.push({
      reason: 'deductCamera',
      percentage: deductions.cameraIssues,
      amount: 0,
    })
  }

  if (functionalityIssues.audio) {
    deductionBreakdown.push({
      reason: 'deductAudio',
      percentage: deductions.audioIssues,
      amount: 0,
    })
  }

  // Piezas no originales
  if (hasNonOriginalParts) {
    deductionBreakdown.push({
      reason: 'deductParts',
      percentage: deductions.nonOriginalParts,
      amount: 0,
    })
  }

  // Estado estético
  if (aestheticCondition === 'minor-details') {
    deductionBreakdown.push({
      reason: 'deductAestheticMinor',
      percentage: deductions.aestheticMinorDetails,
      amount: 0,
    })
  } else if (aestheticCondition === 'visible-damage') {
    deductionBreakdown.push({
      reason: 'deductAestheticDamage',
      percentage: deductions.aestheticVisibleDamage,
      amount: 0,
    })
  }

  // 4. Calcular totales
  const priceAfterStorage = basePrice * storageMultiplier
  const totalDeductionPercentage = deductionBreakdown.reduce((sum, d) => sum + d.percentage, 0)

  // Calcular monto de cada deducción
  deductionBreakdown.forEach((d) => {
    d.amount = Math.round(priceAfterStorage * d.percentage)
  })

  // Precio final (nunca menor a 0)
  const totalDeductionAmount = Math.round(priceAfterStorage * totalDeductionPercentage)
  const finalPrice = Math.max(0, Math.round(priceAfterStorage - totalDeductionAmount))

  return {
    basePrice,
    storageMultiplier,
    totalDeductions: totalDeductionPercentage,
    finalPrice,
    deductionBreakdown,
  }
}

/**
 * Format price as Argentine Pesos
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
