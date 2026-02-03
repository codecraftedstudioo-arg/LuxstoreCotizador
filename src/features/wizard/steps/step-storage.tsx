import { Card, CardHeader, Select, Button } from '@/components/ui'
import { useWizard } from '../hooks/use-wizard'
import type { StorageCapacity } from '../types'

const storageOptions = [
  { value: '128', label: '128 GB' },
  { value: '256', label: '256 GB' },
  { value: '512', label: '512 GB' },
  { value: '1024', label: '1 TB' },
]

/**
 * Step 2: Select storage capacity
 */
export function StepStorage() {
  const { state, setStorage, nextStep } = useWizard()

  return (
    <Card>
      <CardHeader
        title="¿Cuánto almacenamiento tiene?"
        subtitle="Podés verlo en Ajustes → General → Información"
      />
      <Select
        label="Almacenamiento"
        placeholder="Seleccioná la capacidad..."
        options={storageOptions}
        value={state.storage ?? undefined}
        onChange={(val) => setStorage(val as StorageCapacity)}
      />
      <Button onClick={nextStep} fullWidth disabled={!state.storage} className="mt-4">
        Continuar
      </Button>
    </Card>
  )
}
