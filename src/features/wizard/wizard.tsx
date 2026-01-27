import { ProgressBar, Button, VideoBackground, Header } from '@/components/ui'
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
    <>
      {/* Video background */}
      <VideoBackground />

      {/* Main content */}
      <div className="relative min-h-screen flex flex-col">
        {/* Logo header */}
        <Header />

        {/* Wizard content */}
        <main className="flex-1 py-4 px-4">
          <div className="max-w-md mx-auto">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                Cotizá tu iPhone
              </h1>
              <p className="text-white/80 mt-2">
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
        </main>

        {/* Footer */}
        <footer className="py-4 text-center text-white/50 text-sm">
          <a
            href="https://electronicpoint.com.ar/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-400 transition-colors"
          >
            Electronic Point
          </a>
          {' · '}
          Todos los derechos reservados
        </footer>
      </div>
    </>
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
