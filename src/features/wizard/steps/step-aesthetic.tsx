import { Card, CardHeader, Select } from '@/components/ui'
import { useWizard } from '../hooks/use-wizard'
import type { AestheticCondition } from '../types'

const aestheticOptions = [
  { value: 'perfect', label: 'Impecable - Como nuevo' },
  { value: 'minor-details', label: 'Detalles leves - Rayones de uso normal' },
  { value: 'visible-damage', label: 'Golpes visibles - Abolladuras o daños' },
]

/**
 * Step 7: Aesthetic condition
 */
export function StepAesthetic() {
  const { state, setAesthetic } = useWizard()

  return (
    <Card>
      <CardHeader
        title="¿Cómo está el estado estético general?"
        subtitle="Mirá los bordes, la parte trasera y el marco"
      />
      <Select
        label="Estado estético"
        placeholder="Seleccioná el estado..."
        options={aestheticOptions}
        value={state.aestheticCondition ?? undefined}
        onChange={(val) => setAesthetic(val as AestheticCondition)}
      />
    </Card>
  )
}
