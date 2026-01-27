import { describe, it, expect } from 'vitest'
import { calculatePrice, formatPrice } from './pricing-engine'
import type { WizardState } from '@/features/wizard/types'

// Helper para crear estado completo
function createWizardState(overrides: Partial<WizardState> = {}): WizardState {
  return {
    currentStep: 8,
    model: { id: 'iphone-15-pro', name: 'iPhone 15 Pro', basePrice: 1050000 },
    storage: '128',
    batteryBelow80: false,
    screenCondition: 'perfect',
    functionalityIssues: { faceId: false, camera: false, audio: false },
    hasNonOriginalParts: false,
    aestheticCondition: 'perfect',
    ...overrides,
  }
}

describe('calculatePrice', () => {
  it('returns null if model is missing', () => {
    const state = createWizardState({ model: null })
    expect(calculatePrice(state)).toBeNull()
  })

  it('returns null if storage is missing', () => {
    const state = createWizardState({ storage: null })
    expect(calculatePrice(state)).toBeNull()
  })

  it('calculates perfect condition iPhone at base price', () => {
    const state = createWizardState()
    const result = calculatePrice(state)

    expect(result).not.toBeNull()
    expect(result!.finalPrice).toBe(1050000) // Base price for iPhone 15 Pro
    expect(result!.totalDeductions).toBe(0)
    expect(result!.deductionBreakdown).toHaveLength(0)
  })

  it('applies storage multiplier for 256GB', () => {
    const state = createWizardState({ storage: '256' })
    const result = calculatePrice(state)

    expect(result).not.toBeNull()
    // 1,050,000 × 1.10 = 1,155,000
    expect(result!.finalPrice).toBe(1155000)
    expect(result!.storageMultiplier).toBe(1.10)
  })

  it('applies storage multiplier for 1TB', () => {
    const state = createWizardState({ storage: '1024' })
    const result = calculatePrice(state)

    expect(result).not.toBeNull()
    // 1,050,000 × 1.30 = 1,365,000
    expect(result!.finalPrice).toBe(1365000)
    expect(result!.storageMultiplier).toBe(1.30)
  })

  it('applies battery deduction when below 80%', () => {
    const state = createWizardState({ batteryBelow80: true })
    const result = calculatePrice(state)

    expect(result).not.toBeNull()
    // 1,050,000 × (1 - 0.10) = 945,000
    expect(result!.finalPrice).toBe(945000)
    expect(result!.totalDeductions).toBe(0.10)
    expect(result!.deductionBreakdown).toHaveLength(1)
    expect(result!.deductionBreakdown[0].reason).toBe('Batería menor a 80%')
  })

  it('applies screen deductions correctly', () => {
    // Minor scratches
    let state = createWizardState({ screenCondition: 'minor-scratches' })
    let result = calculatePrice(state)
    expect(result!.totalDeductions).toBe(0.05)

    // Cracked
    state = createWizardState({ screenCondition: 'cracked' })
    result = calculatePrice(state)
    expect(result!.totalDeductions).toBe(0.25)
  })

  it('applies Face ID deduction', () => {
    const state = createWizardState({
      functionalityIssues: { faceId: true, camera: false, audio: false },
    })
    const result = calculatePrice(state)

    expect(result!.totalDeductions).toBe(0.15)
    expect(result!.deductionBreakdown.some(d => d.reason === 'Face ID no funciona')).toBe(true)
  })

  it('applies multiple deductions correctly', () => {
    const state = createWizardState({
      batteryBelow80: true, // 10%
      screenCondition: 'minor-scratches', // 5%
      functionalityIssues: { faceId: true, camera: false, audio: false }, // 15%
      hasNonOriginalParts: true, // 10%
      aestheticCondition: 'minor-details', // 5%
    })
    const result = calculatePrice(state)

    expect(result).not.toBeNull()
    // Total deductions: 10 + 5 + 15 + 10 + 5 = 45%
    expect(result!.totalDeductions).toBe(0.45)
    // 1,050,000 × (1 - 0.45) = 577,500
    expect(result!.finalPrice).toBe(577500)
    expect(result!.deductionBreakdown).toHaveLength(5)
  })

  it('combines storage multiplier with deductions', () => {
    const state = createWizardState({
      storage: '256', // 1.10x
      batteryBelow80: true, // 10%
    })
    const result = calculatePrice(state)

    expect(result).not.toBeNull()
    // 1,050,000 × 1.10 = 1,155,000
    // 1,155,000 × (1 - 0.10) = 1,039,500
    expect(result!.finalPrice).toBe(1039500)
  })
})

describe('formatPrice', () => {
  it('formats price as Argentine Pesos', () => {
    const formatted = formatPrice(1050000)
    // Should contain the number and ARS symbol
    expect(formatted).toContain('1.050.000')
  })

  it('handles zero price', () => {
    const formatted = formatPrice(0)
    expect(formatted).toContain('0')
  })
})
