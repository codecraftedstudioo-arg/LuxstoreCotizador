import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type {
  WizardState,
  PhoneModel,
  StorageCapacity,
  ScreenCondition,
  AestheticCondition,
  FunctionalityIssues,
} from '../types'

// Initial state - como el estado inicial de un ViewModel
const initialState: WizardState = {
  currentStep: 1,
  model: null,
  storage: null,
  batteryBelow80: null,
  screenCondition: null,
  functionalityIssues: {
    faceId: false,
    camera: false,
    audio: false,
  },
  hasNonOriginalParts: null,
  aestheticCondition: null,
}

// Actions - como los Commands en CQRS
type WizardAction =
  | { type: 'SET_MODEL'; payload: PhoneModel }
  | { type: 'SET_STORAGE'; payload: StorageCapacity }
  | { type: 'SET_BATTERY'; payload: boolean }
  | { type: 'SET_SCREEN'; payload: ScreenCondition }
  | { type: 'SET_FUNCTIONALITY'; payload: Partial<FunctionalityIssues> }
  | { type: 'SET_ORIGINAL_PARTS'; payload: boolean }
  | { type: 'SET_AESTHETIC'; payload: AestheticCondition }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GO_TO_STEP'; payload: number }
  | { type: 'RESET' }

// Reducer - como un switch en un CommandHandler
function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_MODEL':
      return { ...state, model: action.payload }
    case 'SET_STORAGE':
      return { ...state, storage: action.payload }
    case 'SET_BATTERY':
      return { ...state, batteryBelow80: action.payload }
    case 'SET_SCREEN':
      return { ...state, screenCondition: action.payload }
    case 'SET_FUNCTIONALITY':
      return {
        ...state,
        functionalityIssues: { ...state.functionalityIssues, ...action.payload },
      }
    case 'SET_ORIGINAL_PARTS':
      return { ...state, hasNonOriginalParts: action.payload }
    case 'SET_AESTHETIC':
      return { ...state, aestheticCondition: action.payload }
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 4) }
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) }
    case 'GO_TO_STEP':
      return { ...state, currentStep: action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

// Context - el "contenedor" que guarda el estado
interface WizardContextValue {
  state: WizardState
  setModel: (model: PhoneModel) => void
  setStorage: (storage: StorageCapacity) => void
  setBattery: (below80: boolean) => void
  setScreen: (condition: ScreenCondition) => void
  setFunctionality: (issues: Partial<FunctionalityIssues>) => void
  setOriginalParts: (hasNonOriginal: boolean) => void
  setAesthetic: (condition: AestheticCondition) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  reset: () => void
  isStepComplete: (step: number) => boolean
}

const WizardContext = createContext<WizardContextValue | null>(null)

const STORAGE_KEY = 'wizard-state'

// Cargar estado desde localStorage
function loadState(): WizardState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Error loading wizard state:', e)
  }
  return initialState
}

// Provider - envuelve la app y provee el estado a todos los hijos
export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState, loadState)

  // Guardar en localStorage cuando cambia el estado
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      console.error('Error saving wizard state:', e)
    }
  }, [state])

  const value: WizardContextValue = {
    state,
    // Ya no auto-avanzan - el usuario debe hacer click en Continuar
    setModel: (model) => dispatch({ type: 'SET_MODEL', payload: model }),
    setStorage: (storage) => dispatch({ type: 'SET_STORAGE', payload: storage }),
    setBattery: (below80) => dispatch({ type: 'SET_BATTERY', payload: below80 }),
    setScreen: (condition) => dispatch({ type: 'SET_SCREEN', payload: condition }),
    setFunctionality: (issues) => dispatch({ type: 'SET_FUNCTIONALITY', payload: issues }),
    setOriginalParts: (hasNonOriginal) => dispatch({ type: 'SET_ORIGINAL_PARTS', payload: hasNonOriginal }),
    setAesthetic: (condition) => dispatch({ type: 'SET_AESTHETIC', payload: condition }),
    nextStep: () => dispatch({ type: 'NEXT_STEP' }),
    prevStep: () => dispatch({ type: 'PREV_STEP' }),
    goToStep: (step) => dispatch({ type: 'GO_TO_STEP', payload: step }),
    reset: () => {
      localStorage.removeItem(STORAGE_KEY)
      dispatch({ type: 'RESET' })
    },
    isStepComplete: (step: number) => {
      switch (step) {
        case 1: return state.model !== null
        case 2: return state.storage !== null
        case 3: return state.batteryBelow80 !== null
        case 4: return state.screenCondition !== null
        case 5: return true // Checkboxes siempre están "completos"
        case 6: return state.hasNonOriginalParts !== null
        case 7: return state.aestheticCondition !== null
        default: return false
      }
    },
  }

  return (
    <WizardContext.Provider value={value}>
      {children}
    </WizardContext.Provider>
  )
}

// Hook personalizado - así lo usamos en los componentes
export function useWizard() {
  const context = useContext(WizardContext)
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider')
  }
  return context
}
