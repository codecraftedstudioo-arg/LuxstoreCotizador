import { Card, CardHeader, OptionButton } from '@/components/ui'
import { useWizard } from '../hooks/use-wizard'
import pricingConfig from '@/config/pricing.json'

/**
 * Step 1: Select iPhone model
 * Shows all available models from pricing config
 */
export function StepModel() {
  const { state, setModel } = useWizard()

  return (
    <Card>
      <CardHeader
        title="¿Qué modelo de iPhone tenés?"
        subtitle="Seleccioná el modelo exacto de tu dispositivo"
      />
      <div className="grid gap-3 max-h-96 overflow-y-auto">
        {pricingConfig.models.map((model) => (
          <OptionButton
            key={model.id}
            selected={state.model?.id === model.id}
            onClick={() => setModel(model)}
          >
            {model.name}
          </OptionButton>
        ))}
      </div>
    </Card>
  )
}
