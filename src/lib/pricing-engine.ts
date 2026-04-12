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

  // Original box - fixed USD deduction (not percentage)
  if (state.hasOriginalBox === false) {
    deductionBreakdown.push({
      reason: 'deductNoOriginalBox',
      percentage: 0,
      amount: deductions.noOriginalBox,
    })
  }

  // Calculate totals
  const totalDeductionPercentage = deductionBreakdown.reduce((sum, d) => sum + d.percentage, 0)

  // Round to nearest 5
  const roundTo5 = (n: number) => Math.round(n / 5) * 5

  // Calculate amount for each deduction (skip fixed-amount deductions like noOriginalBox)
  deductionBreakdown.forEach((d) => {
    if (d.percentage > 0) {
      d.amount = roundTo5(basePrice * d.percentage)
    }
  })

  // Sum fixed deductions (amount already set, percentage = 0)
  const fixedDeductions = deductionBreakdown
    .filter((d) => d.percentage === 0 && d.amount > 0)
    .reduce((sum, d) => sum + d.amount, 0)

  // Final price (never below 0)
  const totalDeductionAmount = roundTo5(basePrice * totalDeductionPercentage) + fixedDeductions
  const finalPrice = Math.max(0, roundTo5(basePrice - totalDeductionAmount))

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
 * Format price as US Dollars
 */
export function formatPrice(price: number): string {
  return `USD ${price.toLocaleString('es-AR')}`
}

/**
 * Format storage value for display (e.g. "256" → "256 GB", "1024" → "1 TB")
 */
export function formatStorage(storage: string): string {
  const num = parseInt(storage)
  if (num >= 1024) return `${num / 1024} TB`
  return `${storage} GB`
}
