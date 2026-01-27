import { Card, CardHeader, OptionButton } from '@/components/ui'
import { useWizard } from '../hooks/use-wizard'
import type { ScreenCondition } from '../types'

const screenOptions: { value: ScreenCondition; label: string; description: string }[] = [
  {
    value: 'perfect',
    label: 'Perfecta',
    description: 'Sin rayones ni marcas visibles',
  },
  {
    value: 'minor-scratches',
    label: 'Rayones leves',
    description: 'Pequeñas marcas de uso normal',
  },
  {
    value: 'cracked',
    label: 'Rajada o rota',
    description: 'Grietas, fisuras o píxeles muertos',
  },
]

/**
 * Step 4: Screen condition
 */
export function StepScreen() {
  const { state, setScreen } = useWizard()

  return (
    <Card>
      <CardHeader
        title="¿Cómo está la pantalla?"
        subtitle="Revisá si tiene rayones, grietas o marcas"
      />
      <div className="grid gap-3">
        {screenOptions.map((option) => (
          <OptionButton
            key={option.value}
            selected={state.screenCondition === option.value}
            onClick={() => setScreen(option.value)}
            description={option.description}
          >
            {option.label}
          </OptionButton>
        ))}
      </div>
    </Card>
  )
}
