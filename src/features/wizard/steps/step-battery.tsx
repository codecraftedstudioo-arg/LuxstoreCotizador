import { Card, CardHeader, Select } from '@/components/ui'
import { useWizard } from '../hooks/use-wizard'

const batteryOptions = [
  { value: 'good', label: '80% o más de salud' },
  { value: 'bad', label: 'Menos de 80% de salud' },
]

/**
 * Step 3: Battery health
 * Below 80% = degraded, affects price
 */
export function StepBattery() {
  const { state, setBattery } = useWizard()

  const currentValue = state.batteryBelow80 === undefined
    ? undefined
    : state.batteryBelow80 ? 'bad' : 'good'

  return (
    <Card>
      <CardHeader
        title="¿Cómo está la batería?"
        subtitle="Ajustes → Batería → Estado de la batería"
      />
      <Select
        label="Estado de batería"
        placeholder="Seleccioná el estado..."
        options={batteryOptions}
        value={currentValue}
        onChange={(val) => setBattery(val === 'bad')}
      />
    </Card>
  )
}
