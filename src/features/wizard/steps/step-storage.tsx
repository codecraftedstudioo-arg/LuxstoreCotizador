import { Card, CardHeader, OptionButton } from '@/components/ui'
import { useWizard } from '../hooks/use-wizard'
import type { StorageCapacity } from '../types'

const storageOptions: { value: StorageCapacity; label: string }[] = [
  { value: '128', label: '128 GB' },
  { value: '256', label: '256 GB' },
  { value: '512', label: '512 GB' },
  { value: '1024', label: '1 TB' },
]

/**
 * Step 2: Select storage capacity
 */
export function StepStorage() {
  const { state, setStorage } = useWizard()

  return (
    <Card>
      <CardHeader
        title="¿Cuánto almacenamiento tiene?"
        subtitle="Podés verlo en Ajustes → General → Información"
      />
      <div className="grid grid-cols-2 gap-3">
        {storageOptions.map((option) => (
          <OptionButton
            key={option.value}
            selected={state.storage === option.value}
            onClick={() => setStorage(option.value)}
          >
            {option.label}
          </OptionButton>
        ))}
      </div>
    </Card>
  )
}
