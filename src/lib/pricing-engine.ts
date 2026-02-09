import type { WizardState, PriceResult, PricingConfig } from '@/features/wizard/types'
import pricingData from '@/config/pricing.json'

const config = pricingData as unknown as PricingConfig

/**
 * Pricing Engine - calculates iPhone price based on condition
 *
 * New structure: Fixed prices per model+storage combination
 * Deductions are percentage-based
 * iCloud locked = blocked (no quote)
 */
export function calculatePrice(state: WizardState): PriceResult | null {
  // Validate required fields
  if (!state.model || !state.storage) {
    return null
  }

  // Check for iCloud block
  if (state.iCloudOff === false) {
    return {
      basePrice: 0,
      totalDeductions: 0,
      finalPrice: 0,
      deductionBreakdown: [],
      blocked: true,
      blockedReason: 'iCloudBlocked',
    }
  }

  // Find price for model + storage combination
  const priceEntry = config.prices.find(
    (p) => p.model === state.model && p.storage === state.storage
  )

  if (!priceEntry) {
    return null // Combination not found
  }

  const basePrice = priceEntry.price
  const deductions = config.deductions
  const deductionBreakdown: PriceResult['deductionBreakdown'] = []

  // Screen condition
  if (state.screenCondition === 'cracked') {
    deductionBreakdown.push({
      reason: 'deductScreenCracked',
      percentage: deductions.screenCracked,
      amount: 0,
    })
  } else if (state.screenCondition === 'scratches') {
    deductionBreakdown.push({
      reason: 'deductScreenScratches',
      percentage: deductions.screenScratches,
      amount: 0,
    })
  }

  // Back condition
  if (state.backCondition === 'cracked') {
    deductionBreakdown.push({
      reason: 'deductBackCracked',
      percentage: deductions.backCracked,
      amount: 0,
    })
  }

  // Frame condition
  if (state.frameCondition === 'damaged') {
    deductionBreakdown.push({
      reason: 'deductFrameDamaged',
      percentage: deductions.frameDamaged,
      amount: 0,
    })
  }

  // Liquid damage
  if (state.hasLiquidDamage) {
    deductionBreakdown.push({
      reason: 'deductLiquidDamage',
      percentage: deductions.liquidDamage,
      amount: 0,
    })
  }

  // Battery health
  if (state.batteryHealth === 'low') {
    deductionBreakdown.push({
      reason: 'deductBatteryLow',
      percentage: deductions.batteryBelow85,
      amount: 0,
    })
  }

  // Original parts - battery
  if (state.originalParts.battery === false) {
    deductionBreakdown.push({
      reason: 'deductBatteryNotOriginal',
      percentage: deductions.batteryNotOriginal,
      amount: 0,
    })
  }

  // Original parts - screen
  if (state.originalParts.screen === false) {
    deductionBreakdown.push({
      reason: 'deductScreenNotOriginal',
      percentage: deductions.screenNotOriginal,
      amount: 0,
    })
  }

  // Functionality issues
  if (state.functionalityIssues.faceId) {
    deductionBreakdown.push({
      reason: 'deductFaceId',
      percentage: deductions.faceIdNotWorking,
      amount: 0,
    })
  }

  if (state.functionalityIssues.camera) {
    deductionBreakdown.push({
      reason: 'deductCamera',
      percentage: deductions.cameraNotWorking,
      amount: 0,
    })
  }

  if (state.functionalityIssues.audio) {
    deductionBreakdown.push({
      reason: 'deductAudio',
      percentage: deductions.audioNotWorking,
      amount: 0,
    })
  }

  if (state.functionalityIssues.charging) {
    deductionBreakdown.push({
      reason: 'deductCharging',
      percentage: deductions.chargingNotWorking,
      amount: 0,
    })
  }

  // Calculate totals
  const totalDeductionPercentage = deductionBreakdown.reduce((sum, d) => sum + d.percentage, 0)

  // Calculate amount for each deduction
  deductionBreakdown.forEach((d) => {
    d.amount = Math.round(basePrice * d.percentage)
  })

  // Final price (never below 0)
  const totalDeductionAmount = Math.round(basePrice * totalDeductionPercentage)
  const finalPrice = Math.max(0, Math.round(basePrice - totalDeductionAmount))

  return {
    basePrice,
    totalDeductions: totalDeductionPercentage,
    finalPrice,
    deductionBreakdown,
  }
}

/**
 * Get available models from config
 */
export function getAvailableModels(): string[] {
  const models = new Set(config.prices.map((p) => p.model))
  return Array.from(models)
}

/**
 * Get available storage options for a model
 */
export function getStorageForModel(model: string): string[] {
  return config.prices
    .filter((p) => p.model === model)
    .map((p) => p.storage)
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
