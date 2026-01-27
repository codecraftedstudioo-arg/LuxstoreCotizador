interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

/**
 * Progress bar showing wizard completion
 * Visual feedback of how many steps are left
 */
export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = ((currentStep - 1) / totalSteps) * 100

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2 text-sm text-gray-600">
        <span>Paso {currentStep} de {totalSteps}</span>
        <span>{Math.round(progress)}% completado</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
