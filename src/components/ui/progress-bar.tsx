interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

/**
 * Progress bar showing wizard completion
 * Visual feedback of how many steps are left
 * Uses cyan brand color
 */
export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = ((currentStep - 1) / totalSteps) * 100

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2 text-sm text-white/70">
        <span>Paso {currentStep} de {totalSteps}</span>
        <span>{Math.round(progress)}% completado</span>
      </div>
      <div className="h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-cyan-300 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
