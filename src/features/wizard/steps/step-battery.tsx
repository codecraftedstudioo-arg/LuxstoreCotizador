import { Card, CardHeader, OptionButton } from '@/components/ui'
import { useWizard } from '../hooks/use-wizard'

/**
 * Step 3: Battery health
 * Below 80% = degraded, affects price
 */
export function StepBattery() {
  const { state, setBattery } = useWizard()

  return (
    <Card>
      <CardHeader
        title="¿Cómo está la batería?"
        subtitle="Ajustes → Batería → Estado de la batería"
      />
      <div className="grid gap-3">
        <OptionButton
          selected={state.batteryBelow80 === false}
          onClick={() => setBattery(false)}
          description="La batería mantiene buena autonomía"
        >
          80% o más de salud
        </OptionButton>
        <OptionButton
          selected={state.batteryBelow80 === true}
          onClick={() => setBattery(true)}
          description="Apple recomienda cambiarla"
        >
          Menos de 80% de salud
        </OptionButton>
      </div>
    </Card>
  )
}
