import { ProgressBar, VideoBackground, Header } from '@/components/ui'
import { useWizard, WizardProvider } from './hooks/use-wizard'
import { useI18n } from '@/lib/i18n'
import {
  Step1Basics,
  Step2Condition,
  Step3Details,
  StepResult,
} from './steps'

const TOTAL_STEPS = 3

/**
 * Main wizard content - 3 grouped steps
 * Full-screen image background with Ken Burns effect
 * Wide glassmorphism card centered on screen
 */
function WizardContent() {
  const { state, prevStep } = useWizard()
  const { t } = useI18n()
  const { currentStep } = state

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1Basics />
      case 2: return <Step2Condition />
      case 3: return <Step3Details />
      case 4: return <StepResult />
      default: return <Step1Basics />
    }
  }

  const showBackButton = currentStep > 1 && currentStep <= TOTAL_STEPS
  const showProgress = currentStep <= TOTAL_STEPS

  return (
    <div className="min-h-screen relative">
      {/* Full background with images */}
      <div className="fixed inset-0 -z-10">
        <VideoBackground />
      </div>

      {/* Centered wizard container */}
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <Header />

        {/* Wizard content - subtle integrated card */}
        <main className="flex-1 py-4 px-4 overflow-y-auto flex items-center justify-center">
          <div className="w-full max-w-2xl bg-black/40 backdrop-blur-md rounded-3xl p-6 lg:p-8">
            {/* Title - compact */}
            <div className="text-center mb-4 lg:mb-6">
              <div className="flex items-center justify-center gap-2 mb-1">
                <AppleIcon className="w-7 h-7 text-white/80" />
                <h1 className="text-2xl lg:text-3xl font-bold text-white">
                  {t('title')}
                </h1>
              </div>
              <p className="text-gray-300 text-sm mt-2">
                {t('subtitle')}
              </p>
            </div>

            {/* Progress bar with back button */}
            {showProgress && (
              <div className="mb-4 flex items-center gap-3">
                {showBackButton && (
                  <button
                    onClick={prevStep}
                    className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <div className="flex-1">
                  <ProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
                </div>
              </div>
            )}

            {/* Current step - con animación */}
            <div key={currentStep} className="relative z-10 animate-fadeSlideIn">
              {renderStep()}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 text-center text-white/60 text-sm">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href="https://electronicpoint.com.ar/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Electronic Point
            </a>
            <span>·</span>
            <a
              href="https://maps.google.com/?q=Electronic+Point,+Costa+Rica+5509,+Buenos+Aires"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('howToGet')}
            </a>
          </div>
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

/** Apple icon - manzana simple */
function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  )
}
