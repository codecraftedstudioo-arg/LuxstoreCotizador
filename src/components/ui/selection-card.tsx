import type { ReactNode } from 'react'
import { formatStorage } from '@/lib/pricing-engine'

interface SelectionCardProps {
  selected: boolean
  onClick: () => void
  icon?: ReactNode
  label: string
  description?: string
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Visual selection card for wizard options
 * Replaces dropdowns with clickable cards
 */
export function SelectionCard({
  selected,
  onClick,
  icon,
  label,
  description,
  disabled = false,
  size = 'md',
}: SelectionCardProps) {
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full text-left rounded-xl border-2 transition-all duration-200
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${selected
          ? 'border-green-500 bg-green-500/10 shadow-lg shadow-green-500/20'
          : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
        }
      `}
    >
      <div className="flex items-center gap-3">
        {icon && (
          <div className={`
            flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
            ${selected ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/60'}
          `}>
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className={`font-medium truncate ${selected ? 'text-white' : 'text-white/80'}`}>
            {label}
          </p>
          {description && (
            <p className="text-sm text-white/50 truncate">{description}</p>
          )}
        </div>
        {selected && (
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
    </button>
  )
}

interface StoragePillProps {
  value: string
  selected: boolean
  onClick: () => void
  disabled?: boolean
}

/**
 * Pill button for storage selection
 */
export function StoragePill({ value, selected, onClick, disabled }: StoragePillProps) {
  const label = formatStorage(value)

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2.5 rounded-full font-medium text-sm transition-all duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${selected
          ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
          : 'bg-white/10 text-white/70 hover:bg-white/20'
        }
      `}
    >
      {label}
    </button>
  )
}

interface ConditionCardProps {
  selected: boolean
  onClick: () => void
  icon: ReactNode
  label: string
  variant?: 'good' | 'warning' | 'bad'
}

/**
 * Condition card with color variants
 */
export function ConditionCard({ selected, onClick, icon, label, variant = 'good' }: ConditionCardProps) {
  const variantStyles = {
    good: selected ? 'border-green-500 bg-green-500/10' : 'border-white/10 bg-white/5 hover:border-green-500/50',
    warning: selected ? 'border-yellow-500 bg-yellow-500/10' : 'border-white/10 bg-white/5 hover:border-yellow-500/50',
    bad: selected ? 'border-red-500 bg-red-500/10' : 'border-white/10 bg-white/5 hover:border-red-500/50',
  }

  const iconColor = {
    good: selected ? 'text-green-400' : 'text-white/50',
    warning: selected ? 'text-yellow-400' : 'text-white/50',
    bad: selected ? 'text-red-400' : 'text-white/50',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200
        ${variantStyles[variant]}
      `}
    >
      <div className={`w-8 h-8 ${iconColor[variant]}`}>
        {icon}
      </div>
      <span className={`text-sm font-medium text-center ${selected ? 'text-white' : 'text-white/70'}`}>
        {label}
      </span>
    </button>
  )
}

interface ToggleCardProps {
  selected: boolean
  onClick: () => void
  icon: ReactNode
  label: string
  isPositive?: boolean
  neutral?: boolean
}

/**
 * Toggle card for yes/no options
 */
export function ToggleCard({ selected, onClick, icon, label, isPositive = true, neutral = false }: ToggleCardProps) {
  // Neutral uses gray for both options
  const selectedColor = neutral
    ? 'border-white/40 bg-white/10'
    : isPositive
      ? 'border-green-500 bg-green-500/10'
      : 'border-red-500 bg-red-500/10'

  const iconSelected = neutral
    ? 'text-white'
    : isPositive
      ? 'text-green-400'
      : 'text-red-400'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex-1 flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200
        ${selected ? selectedColor : 'border-white/10 bg-white/5 hover:border-white/30'}
      `}
    >
      <div className={`w-10 h-10 ${selected ? iconSelected : 'text-white/50'}`}>
        {icon}
      </div>
      <span className={`text-sm sm:text-base font-medium text-center leading-tight ${selected ? 'text-white' : 'text-white/70'}`}>
        {label}
      </span>
    </button>
  )
}
