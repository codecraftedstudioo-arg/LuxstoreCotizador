import { describe, it, expect } from 'vitest'
import { calculatePrice, formatPrice, getAvailableModels, getStorageForModel } from './pricing-engine'
import type { WizardState } from '@/features/wizard/types'

// Helper para crear estado completo con nueva estructura
function createWizardState(overrides: Partial<WizardState> = {}): WizardState {
  return {
    currentStep: 6,
    model: 'iPhone 15 Pro',
    storage: '128',
    screenCondition: 'perfect',
    backCondition: 'perfect',
    frameCondition: 'perfect',
    hasLiquidDamage: false,
    batteryHealth: 'good',
    originalParts: { screen: true, battery: true },
    functionalityIssues: { faceId: false, camera: false, audio: false, charging: false },
    iCloudOff: true,
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

  it('returns blocked if iCloud is on', () => {
    const state = createWizardState({ iCloudOff: false })
    const result = calculatePrice(state)

    expect(result).not.toBeNull()
    expect(result!.blocked).toBe(true)
    expect(result!.blockedReason).toBe('iCloudBlocked')
  })

  it('calculates perfect condition iPhone at fixed price', () => {
    const state = createWizardState()
    const result = calculatePrice(state)

    expect(result).not.toBeNull()
    expect(result!.finalPrice).toBe(550000) // Fixed price for iPhone 15 Pro 128GB
    expect(result!.totalDeductions).toBe(0)
    expect(result!.deductionBreakdown).toHaveLength(0)
  })

  it('returns correct price for different storage', () => {
    const state = createWizardState({ storage: '256' })
    const result = calculatePrice(state)

    expect(result).not.toBeNull()
    expect(result!.finalPrice).toBe(600000) // Fixed price for iPhone 15 Pro 256GB
  })

  it('applies battery low deduction (15%)', () => {
    const state = createWizardState({ batteryHealth: 'low' })
    const result = calculatePrice(state)

    expect(result).not.toBeNull()
    // 550,000 × 0.15 = 82,500 deduction
    expect(result!.totalDeductions).toBe(0.15)
    expect(result!.finalPrice).toBe(467500)
    expect(result!.deductionBreakdown).toHaveLength(1)
    expect(result!.deductionBreakdown[0].reason).toBe('deductBatteryLow')
  })

  it('applies screen cracked deduction (50%)', () => {
    const state = createWizardState({ screenCondition: 'cracked' })
    const result = calculatePrice(state)

    expect(result!.totalDeductions).toBe(0.50)
    expect(result!.deductionBreakdown.some(d => d.reason === 'deductScreenCracked')).toBe(true)
  })

  it('applies screen scratches deduction (5%)', () => {
    const state = createWizardState({ screenCondition: 'scratches' })
    const result = calculatePrice(state)

    expect(result!.totalDeductions).toBe(0.05)
  })

  it('applies back cracked deduction (15%)', () => {
    const state = createWizardState({ backCondition: 'cracked' })
    const result = calculatePrice(state)

    expect(result!.totalDeductions).toBe(0.15)
    expect(result!.deductionBreakdown.some(d => d.reason === 'deductBackCracked')).toBe(true)
  })

  it('applies frame damaged deduction (8%)', () => {
    const state = createWizardState({ frameCondition: 'damaged' })
    const result = calculatePrice(state)

    expect(result!.totalDeductions).toBe(0.08)
    expect(result!.deductionBreakdown.some(d => d.reason === 'deductFrameDamaged')).toBe(true)
  })

  it('applies liquid damage deduction (20%)', () => {
    const state = createWizardState({ hasLiquidDamage: true })
    const result = calculatePrice(state)

    expect(result!.totalDeductions).toBe(0.20)
    expect(result!.deductionBreakdown.some(d => d.reason === 'deductLiquidDamage')).toBe(true)
  })

  it('applies non-original battery deduction (15%)', () => {
    const state = createWizardState({
      originalParts: { screen: true, battery: false },
    })
    const result = calculatePrice(state)

    expect(result!.totalDeductions).toBe(0.15)
    expect(result!.deductionBreakdown.some(d => d.reason === 'deductBatteryNotOriginal')).toBe(true)
  })

  it('applies non-original screen deduction (50%)', () => {
    const state = createWizardState({
      originalParts: { screen: false, battery: true },
    })
    const result = calculatePrice(state)

    expect(result!.totalDeductions).toBe(0.50)
    expect(result!.deductionBreakdown.some(d => d.reason === 'deductScreenNotOriginal')).toBe(true)
  })

  it('applies Face ID deduction (30%)', () => {
    const state = createWizardState({
      functionalityIssues: { faceId: true, camera: false, audio: false, charging: false },
    })
    const result = calculatePrice(state)

    expect(result!.totalDeductions).toBe(0.30)
    expect(result!.deductionBreakdown.some(d => d.reason === 'deductFaceId')).toBe(true)
  })

  it('applies camera deduction (30%)', () => {
    const state = createWizardState({
      functionalityIssues: { faceId: false, camera: true, audio: false, charging: false },
    })
    const result = calculatePrice(state)

    expect(result!.totalDeductions).toBe(0.30)
    expect(result!.deductionBreakdown.some(d => d.reason === 'deductCamera')).toBe(true)
  })

  it('applies charging deduction (30%)', () => {
    const state = createWizardState({
      functionalityIssues: { faceId: false, camera: false, audio: false, charging: true },
    })
    const result = calculatePrice(state)

    expect(result!.totalDeductions).toBe(0.30)
    expect(result!.deductionBreakdown.some(d => d.reason === 'deductCharging')).toBe(true)
  })

  it('applies multiple deductions correctly', () => {
    const state = createWizardState({
      batteryHealth: 'low', // 15%
      screenCondition: 'scratches', // 5%
      frameCondition: 'damaged', // 8%
    })
    const result = calculatePrice(state)

    expect(result).not.toBeNull()
    // Total deductions: 15 + 5 + 8 = 28%
    expect(result!.totalDeductions).toBe(0.28)
    // 550,000 × (1 - 0.28) = 396,000
    expect(result!.finalPrice).toBe(396000)
    expect(result!.deductionBreakdown).toHaveLength(3)
  })
})

describe('getAvailableModels', () => {
  it('returns array of model names', () => {
    const models = getAvailableModels()
    expect(Array.isArray(models)).toBe(true)
    expect(models.length).toBeGreaterThan(0)
    expect(models).toContain('iPhone 15 Pro')
  })
})

describe('getStorageForModel', () => {
  it('returns storage options for a model', () => {
    const storage = getStorageForModel('iPhone 15 Pro')
    expect(Array.isArray(storage)).toBe(true)
    expect(storage).toContain('128')
    expect(storage).toContain('256')
  })

  it('returns empty array for unknown model', () => {
    const storage = getStorageForModel('Unknown Model')
    expect(storage).toHaveLength(0)
  })
})

describe('formatPrice', () => {
  it('formats price as Argentine Pesos', () => {
    const formatted = formatPrice(550000)
    // Should contain the number and ARS symbol
    expect(formatted).toContain('550.000')
  })

  it('handles zero price', () => {
    const formatted = formatPrice(0)
    expect(formatted).toContain('0')
  })
})
