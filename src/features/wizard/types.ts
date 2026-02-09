/**
 * Storage capacity options in GB
 */
export type StorageCapacity = '128' | '256' | '512' | '1024'

/**
 * Screen condition options
 */
export type ScreenCondition = 'perfect' | 'scratches' | 'cracked'

/**
 * Back glass condition
 */
export type BackCondition = 'perfect' | 'cracked'

/**
 * Frame/chassis condition
 */
export type FrameCondition = 'perfect' | 'damaged'

/**
 * Functionality issues that can affect price
 */
export interface FunctionalityIssues {
  faceId: boolean
  camera: boolean
  audio: boolean
  charging: boolean
}

/**
 * Original parts status
 */
export interface OriginalParts {
  screen: boolean | null  // true = original, false = not original, null = not answered
  battery: boolean | null // true = original, false = not original, null = not answered
}

/**
 * Complete wizard state - all selections made by user
 */
export interface WizardState {
  currentStep: number

  // Step 1: Basic info
  model: string | null
  storage: StorageCapacity | null

  // Step 2: Physical condition
  screenCondition: ScreenCondition | null
  backCondition: BackCondition | null
  frameCondition: FrameCondition | null
  hasLiquidDamage: boolean | null

  // Step 3: Battery & Original parts
  batteryHealth: 'good' | 'low' | null  // good = >=85%, low = <85%
  originalParts: OriginalParts

  // Step 4: Functionality
  functionalityIssues: FunctionalityIssues

  // Step 5: iCloud (blocker)
  iCloudOff: boolean | null  // true = desbloqueado, false = bloqueado (no cotiza)
}

/**
 * Price entry from config
 */
export interface PriceEntry {
  model: string
  storage: string
  price: number
}

/**
 * Pricing configuration loaded from JSON
 */
export interface PricingConfig {
  prices: PriceEntry[]
  deductions: {
    screenCracked: number
    screenScratches: number
    backCracked: number
    frameDamaged: number
    liquidDamage: number
    batteryBelow85: number
    batteryNotOriginal: number
    screenNotOriginal: number
    faceIdNotWorking: number
    cameraNotWorking: number
    audioNotWorking: number
    chargingNotWorking: number
  }
  currency: string
  lastUpdated: string
}

/**
 * Result of price calculation
 */
export interface PriceResult {
  basePrice: number
  totalDeductions: number
  finalPrice: number
  deductionBreakdown: {
    reason: string
    percentage: number
    amount: number
  }[]
  blocked?: boolean  // true if iCloud locked
  blockedReason?: string
}
