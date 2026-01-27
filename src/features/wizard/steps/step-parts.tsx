import { Card, CardHeader, OptionButton } from '@/components/ui'
import { useWizard } from '../hooks/use-wizard'

/**
 * Step 6: Original parts
 * Non-original parts (screen, battery replaced by non-Apple) affect price
 */
export function StepParts() {
  const { state, setOriginalParts } = useWizard()

  return (
    <Card>
      <CardHeader
        title="¿Tiene todas las piezas originales?"
        subtitle="Si le cambiaron pantalla, batería u otra pieza fuera de Apple, indicalo"
      />
      <div className="grid gap-3">
        <OptionButton
          selected={state.hasNonOriginalParts === false}
          onClick={() => setOriginalParts(false)}
          description="Nunca se reparó o solo en servicio técnico Apple"
        >
          Sí, todo original
        </OptionButton>
        <OptionButton
          selected={state.hasNonOriginalParts === true}
          onClick={() => setOriginalParts(true)}
          description="Tiene piezas de terceros o reparaciones no oficiales"
        >
          No, tiene piezas no originales
        </OptionButton>
      </div>
    </Card>
  )
}
