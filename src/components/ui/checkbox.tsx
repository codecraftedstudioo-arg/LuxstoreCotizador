interface CheckboxProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  description?: string
}

/**
 * Checkbox for functionality issues
 * User checks what DOESN'T work
 */
export function Checkbox({ label, checked, onChange, description }: CheckboxProps) {
  return (
    <label className={`
      flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-all
      border ${checked ? 'border-white bg-white/10' : 'border-gray-600 hover:border-gray-500'}
    `}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-5 w-5 rounded border-gray-500 bg-transparent text-white focus:ring-white"
      />
      <div>
        <div className="font-medium text-white">{label}</div>
        {description && (
          <div className="text-sm text-gray-400">{description}</div>
        )}
      </div>
    </label>
  )
}
