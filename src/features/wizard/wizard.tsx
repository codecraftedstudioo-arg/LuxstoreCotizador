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
 * Main wizard content - Split View Layout
 * Desktop: Images left (50%) | Wizard right (50%)
 * Mobile: Full width wizard with background
 */
function WizardContent() {
  const { state, prevStep } = useWizard()
  const { currentStep } = state

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepModel />
      case 2: return <StepStorage />
      case 3: return <StepBattery />
      case 4: return <StepScreen />
      case 5: return <StepFunctionality />
      case 6: return <StepParts />
      case 7: return <StepAesthetic />
      case 8: return <StepResult />
      default: return <StepModel />
    }
  }

  const showBackButton = currentStep > 1 && currentStep <= TOTAL_STEPS
  const showProgress = currentStep <= TOTAL_STEPS

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT SIDE - Images (hidden on mobile, visible on desktop) */}
      <div className="hidden lg:block lg:w-1/2 lg:fixed lg:inset-y-0 lg:left-0">
        <VideoBackground />
      </div>

      {/* Mobile background (only visible on mobile) */}
      <div className="lg:hidden fixed inset-0 -z-10">
        <VideoBackground />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* RIGHT SIDE - Wizard */}
      <div className="w-full lg:w-1/2 lg:ml-auto min-h-screen flex flex-col bg-gray-950/90 lg:bg-gray-950">
        {/* Header */}
        <Header />

        {/* Wizard content */}
        <main className="flex-1 py-6 px-4 overflow-y-auto">
          <div className="max-w-md mx-auto">
            {/* Title */}
            <div className="text-center mb-8">
              <p className="text-cyan-400 text-sm font-medium tracking-wide uppercase mb-2">
                Electronic Point
              </p>
              <h1 className="text-3xl font-bold text-white">
                ¿Cuánto vale tu iPhone?
              </h1>
              <p className="text-gray-400 mt-2">
                Cotizá en menos de 1 minuto · Pago inmediato
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
        <footer className="py-4 text-center text-gray-500 text-sm border-t border-gray-800">
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
