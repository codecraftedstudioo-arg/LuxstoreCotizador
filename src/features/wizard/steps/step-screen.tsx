import { Card, CardHeader, Select } from '@/components/ui'
import { useWizard } from '../hooks/use-wizard'
import type { ScreenCondition } from '../types'

const screenOptions = [
  { value: 'perfect', label: 'Perfecta - Sin rayones ni marcas' },
  { value: 'minor-scratches', label: 'Rayones leves - Marcas de uso normal' },
  { value: 'cracked', label: 'Rajada o rota - Grietas o píxeles muertos' },
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
      <Select
        label="Estado de pantalla"
        placeholder="Seleccioná el estado..."
        options={screenOptions}
        value={state.screenCondition ?? undefined}
        onChange={(val) => setScreen(val as ScreenCondition)}
      />
    </Card>
  )
}
