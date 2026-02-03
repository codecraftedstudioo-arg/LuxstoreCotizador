import { Card, CardHeader, Select, Button } from '@/components/ui'
import { useWizard } from '../hooks/use-wizard'
import pricingConfig from '@/config/pricing.json'

/**
 * Step 1: Select iPhone model
 */
export function StepModel() {
  const { state, setModel, nextStep } = useWizard()

  const modelOptions = pricingConfig.models.map((model) => ({
    value: model.id,
    label: model.name,
  }))

  const handleSelect = (modelId: string) => {
    const model = pricingConfig.models.find(m => m.id === modelId)
    if (model) setModel(model)
  }

  return (
    <Card>
      <CardHeader
        title="¿Qué modelo de iPhone tenés?"
        subtitle="Seleccioná el modelo exacto de tu dispositivo"
      />
      <Select
        label="Modelo"
        placeholder="Seleccioná tu modelo..."
        options={modelOptions}
        value={state.model?.id}
        onChange={handleSelect}
      />
      <Button onClick={nextStep} fullWidth disabled={!state.model} className="mt-4">
        Continuar
      </Button>
    </Card>
  )
}
