import { Card, CardHeader, Select, Button } from '@/components/ui'
import { useWizard } from '../hooks/use-wizard'
import { useI18n } from '@/lib/i18n'
import pricingConfig from '@/config/pricing.json'
import type { StorageCapacity } from '../types'

/**
 * Step 1: Basics - Model + Storage
 */
export function Step1Basics() {
  const { state, setModel, setStorage, nextStep } = useWizard()
  const { t, lang } = useI18n()

  const storageOptions = [
    { value: '128', label: '128 GB' },
    { value: '256', label: '256 GB' },
    { value: '512', label: '512 GB' },
    { value: '1024', label: t('storage1TB') },
  ]

  const modelOptions = pricingConfig.models.map((model) => ({
    value: model.id,
    label: model.name,
  }))

  const handleModelSelect = (modelId: string) => {
    const model = pricingConfig.models.find(m => m.id === modelId)
    if (model) setModel(model)
  }

  const canContinue = state.model && state.storage

  return (
    <Card>
      <CardHeader
        title={t('step1Title')}
        subtitle={t('step1Subtitle')}
      />

      <div className="space-y-4">
        <Select
          label={lang === 'es' ? 'Modelo de iPhone' : 'iPhone Model'}
          placeholder={t('selectModel')}
          options={modelOptions}
          value={state.model?.id}
          onChange={handleModelSelect}
        />

        <Select
          label={t('selectStorage')}
          placeholder={lang === 'es' ? 'Seleccioná la capacidad...' : 'Select capacity...'}
          options={storageOptions}
          value={state.storage ?? undefined}
          onChange={(val) => setStorage(val as StorageCapacity)}
          disabled={!state.model}
        />
      </div>

      <Button onClick={nextStep} fullWidth disabled={!canContinue} className="mt-6">
        {t('continue')}
      </Button>
    </Card>
  )
}
