import type { ReactNode } from 'react'

interface OptionButtonProps {
  children: ReactNode
  selected?: boolean
  onClick: () => void
  disabled?: boolean
  description?: string
}

/**
 * Option button for wizard selections
 * When clicked, it shows as selected with a blue border
 */
export function OptionButton({
  children,
  selected = false,
  onClick,
  disabled = false,
  description,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full p-4 rounded-xl border-2 text-left transition-all duration-200
        ${selected
          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className="font-medium text-gray-900">{children}</div>
      {description && (
        <div className="mt-1 text-sm text-gray-500">{description}</div>
      )}
    </button>
  )
}
