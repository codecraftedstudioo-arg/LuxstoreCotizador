import { Card, CardHeader, OptionButton } from '@/components/ui'
import { useWizard } from '../hooks/use-wizard'
import type { AestheticCondition } from '../types'

const aestheticOptions: { value: AestheticCondition; label: string; description: string }[] = [
  {
    value: 'perfect',
    label: 'Impecable',
    description: 'Como nuevo, sin marcas de uso',
  },
  {
    value: 'minor-details',
    label: 'Detalles leves',
    description: 'Pequeños rayones o marcas de uso normal',
  },
  {
    value: 'visible-damage',
    label: 'Golpes visibles',
    description: 'Abolladuras, golpes o daños notorios',
  },
]

/**
 * Step 7: Aesthetic condition
 * Overall cosmetic state of the device
 */
export function StepAesthetic() {
  const { state, setAesthetic } = useWizard()

  return (
    <Card>
      <CardHeader
        title="¿Cómo está el estado estético general?"
        subtitle="Mirá los bordes, la parte trasera y el marco"
      />
      <div className="grid gap-3">
        {aestheticOptions.map((option) => (
          <OptionButton
            key={option.value}
            selected={state.aestheticCondition === option.value}
            onClick={() => setAesthetic(option.value)}
            description={option.description}
          >
            {option.label}
          </OptionButton>
        ))}
      </div>
    </Card>
  )
}
