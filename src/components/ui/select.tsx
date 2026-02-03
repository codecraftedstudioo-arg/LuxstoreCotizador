import { useState, useRef, useEffect } from 'react'

interface Option {
  value: string
  label: string
}

interface SelectProps {
  label: string
  placeholder?: string
  options: Option[]
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
}

/**
 * Custom dropdown select - Kavak style
 * Closed by default, opens on click
 */
export function Select({
  label,
  placeholder = 'Seleccionar...',
  options,
  value,
  onChange,
  disabled = false
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(o => o.value === value)

  return (
    <div ref={ref} className="relative">
      {/* Label */}
      <label className="block text-sm text-white font-medium mb-1.5">{label}</label>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-xl text-left
          flex items-center justify-between
          border transition-all duration-200
          ${disabled
            ? 'bg-gray-800/50 border-gray-700 text-gray-500 cursor-not-allowed'
            : isOpen
              ? 'bg-gray-800 border-white text-white'
              : 'bg-gray-800/80 border-gray-600 text-white hover:border-gray-400'
          }
        `}
      >
        <span className={selectedOption ? 'text-white' : 'text-gray-500'}>
          {selectedOption?.label || placeholder}
        </span>

        {/* Chevron */}
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown options */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 py-2 bg-gray-800 border border-gray-600 rounded-xl shadow-xl max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={`
                w-full px-4 py-2.5 text-left transition-colors
                ${option.value === value
                  ? 'bg-white/20 text-white font-medium'
                  : 'text-white hover:bg-gray-700'
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
