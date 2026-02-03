import { Card, CardHeader, Select, Checkbox, Button } from '@/components/ui'
import { useWizard } from '../hooks/use-wizard'
import { useI18n } from '@/lib/i18n'
import type { AestheticCondition } from '../types'

/**
 * Step 3: Details - Functionality + Aesthetic
 */
export function Step3Details() {
  const { state, setFunctionality, setAesthetic, nextStep } = useWizard()
  const { t, lang } = useI18n()

  const aestheticOptions = [
    { value: 'perfect', label: lang === 'es' ? 'Impecable - Como nuevo' : 'Pristine - Like new' },
    { value: 'minor-details', label: lang === 'es' ? 'Detalles leves - Rayones de uso normal' : 'Minor details - Normal wear scratches' },
    { value: 'visible-damage', label: lang === 'es' ? 'Golpes visibles - Abolladuras o daños' : 'Visible damage - Dents or damage' },
  ]

  const canContinue = state.aestheticCondition !== null

  return (
    <Card>
      <CardHeader
        title={t('step3Title')}
        subtitle={t('step3Subtitle')}
      />

      <div className="space-y-6">
        {/* Aesthetic dropdown */}
        <Select
          label={lang === 'es' ? 'Estado estético general' : 'Overall aesthetic condition'}
          placeholder={lang === 'es' ? 'Seleccioná el estado...' : 'Select condition...'}
          options={aestheticOptions}
          value={state.aestheticCondition ?? undefined}
          onChange={(val) => setAesthetic(val as AestheticCondition)}
        />

        {/* Functionality checkboxes */}
        <div>
          <label className="block text-sm text-white font-medium mb-3">
            {lang === 'es' ? '¿Tiene alguno de estos problemas? (opcional)' : 'Does it have any of these issues? (optional)'}
          </label>
          <div className="space-y-2">
            <Checkbox
              label={t('faceId')}
              checked={state.functionalityIssues.faceId}
              onChange={(checked) => setFunctionality({ faceId: checked })}
            />
            <Checkbox
              label={lang === 'es' ? 'Cámara con fallas' : 'Camera issues'}
              checked={state.functionalityIssues.camera}
              onChange={(checked) => setFunctionality({ camera: checked })}
            />
            <Checkbox
              label={lang === 'es' ? 'Audio o parlantes con problemas' : 'Audio or speaker problems'}
              checked={state.functionalityIssues.audio}
              onChange={(checked) => setFunctionality({ audio: checked })}
            />
          </div>
        </div>
      </div>

      <Button onClick={nextStep} fullWidth disabled={!canContinue} className="mt-6">
        {lang === 'es' ? 'Ver cotización' : 'Get quote'}
      </Button>
    </Card>
  )
}
