/**
 * Represents an iPhone model with its base price
 */
export interface PhoneModel {
  id: string
  name: string
  basePrice: number
}

/**
 * Storage capacity options in GB
 */
export type StorageCapacity = '128' | '256' | '512' | '1024'

/**
 * Screen condition options
 */
export type ScreenCondition = 'perfect' | 'minor-scratches' | 'cracked'

/**
 * Aesthetic condition options
 */
export type AestheticCondition = 'perfect' | 'minor-details' | 'visible-damage'

/**
 * Functionality issues that can affect price
 */
export interface FunctionalityIssues {
  faceId: boolean
  camera: boolean
  audio: boolean
}

/**
 * Complete wizard state - all selections made by user
 */
export interface WizardState {
  currentStep: number
  model: PhoneModel | null
  storage: StorageCapacity | null
  batteryBelow80: boolean | null
  screenCondition: ScreenCondition | null
  functionalityIssues: FunctionalityIssues
  hasNonOriginalParts: boolean | null
  aestheticCondition: AestheticCondition | null
}

/**
 * Pricing configuration loaded from JSON
 */
export interface PricingConfig {
  models: PhoneModel[]
  storageMultipliers: Record<StorageCapacity, number>
  deductions: {
    batteryBelow80: number
    screenMinorScratches: number
    screenCracked: number
    faceIdNotWorking: number
    cameraIssues: number
    audioIssues: number
    nonOriginalParts: number
    aestheticMinorDetails: number
    aestheticVisibleDamage: number
  }
  currency: string
  lastUpdated: string
}

/**
 * Result of price calculation
 */
export interface PriceResult {
  basePrice: number
  storageMultiplier: number
  totalDeductions: number
  finalPrice: number
  deductionBreakdown: {
    reason: string
    percentage: number
    amount: number
  }[]
}
