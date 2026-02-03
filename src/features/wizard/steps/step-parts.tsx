import { Card, CardHeader, Select } from '@/components/ui'
import { useWizard } from '../hooks/use-wizard'

const partsOptions = [
  { value: 'original', label: 'Sí, todo original (Apple o servicio oficial)' },
  { value: 'non-original', label: 'No, tiene piezas no originales' },
]

/**
 * Step 6: Original parts
 */
export function StepParts() {
  const { state, setOriginalParts } = useWizard()

  const currentValue = state.hasNonOriginalParts === undefined
    ? undefined
    : state.hasNonOriginalParts ? 'non-original' : 'original'

  return (
    <Card>
      <CardHeader
        title="¿Tiene todas las piezas originales?"
        subtitle="Si le cambiaron pantalla, batería u otra pieza fuera de Apple, indicalo"
      />
      <Select
        label="Piezas"
        placeholder="Seleccioná..."
        options={partsOptions}
        value={currentValue}
        onChange={(val) => setOriginalParts(val === 'non-original')}
      />
    </Card>
  )
}
