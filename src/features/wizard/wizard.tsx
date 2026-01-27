import { ProgressBar, Button } from '@/components/ui'
import { useWizard, WizardProvider } from './hooks/use-wizard'
import {
  StepModel,
  StepStorage,
  StepBattery,
  StepScreen,
  StepFunctionality,
  StepParts,
  StepAesthetic,
  StepResult,
} from './steps'

const TOTAL_STEPS = 7

/**
 * Main wizard content - renders the current step
 */
function WizardContent() {
  const { state, prevStep } = useWizard()
  const { currentStep } = state

  // Renderizar el paso actual
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepModel />
      case 2:
        return <StepStorage />
      case 3:
        return <StepBattery />
      case 4:
        return <StepScreen />
      case 5:
        return <StepFunctionality />
      case 6:
        return <StepParts />
      case 7:
        return <StepAesthetic />
      case 8:
        return <StepResult />
      default:
        return <StepModel />
    }
  }

  const showBackButton = currentStep > 1 && currentStep <= TOTAL_STEPS
  const showProgress = currentStep <= TOTAL_STEPS

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Cotizá tu iPhone
          </h1>
          <p className="text-gray-600 mt-1">
            Obtené un precio en menos de 1 minuto
          </p>
        </div>

        {/* Progress bar */}
        {showProgress && (
          <div className="mb-6">
            <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
          </div>
        )}

        {/* Current step */}
        <div className="mb-6">
          {renderStep()}
        </div>

        {/* Back button */}
        {showBackButton && (
          <Button variant="outline" onClick={prevStep} fullWidth>
            ← Volver al paso anterior
          </Button>
        )}
      </div>
    </div>
  )
}

/**
 * Wizard component with provider
 * Wrap content in provider so useWizard works
 */
export function Wizard() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  )
}
