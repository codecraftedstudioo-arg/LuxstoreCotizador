import { Card, CardHeader, Select, Button } from '@/components/ui'
import { useWizard } from '../hooks/use-wizard'
import { useI18n } from '@/lib/i18n'
import type { ScreenCondition } from '../types'

/**
 * Step 2: Condition - Battery + Screen + Parts
 */
export function Step2Condition() {
  const { state, setBattery, setScreen, setOriginalParts, nextStep } = useWizard()
  const { t, lang } = useI18n()

  const batteryOptions = [
    { value: 'good', label: t('batteryNo') },
    { value: 'bad', label: t('batteryYes') },
  ]

  const screenOptions = [
    { value: 'perfect', label: lang === 'es' ? 'Perfecta - Sin rayones ni marcas' : 'Perfect - No scratches or marks' },
    { value: 'minor-scratches', label: lang === 'es' ? 'Rayones leves - Marcas de uso normal' : 'Minor scratches - Normal wear marks' },
    { value: 'cracked', label: lang === 'es' ? 'Rajada o rota - Grietas o píxeles muertos' : 'Cracked or broken - Cracks or dead pixels' },
  ]

  const partsOptions = [
    { value: 'original', label: lang === 'es' ? 'Sí, todo original (Apple o servicio oficial)' : 'Yes, all original (Apple or official service)' },
    { value: 'non-original', label: lang === 'es' ? 'No, tiene piezas no originales' : 'No, has non-original parts' },
  ]

  const batteryValue = state.batteryBelow80 === null
    ? undefined
    : state.batteryBelow80 ? 'bad' : 'good'

  const partsValue = state.hasNonOriginalParts === null
    ? undefined
    : state.hasNonOriginalParts ? 'non-original' : 'original'

  const canContinue =
    state.batteryBelow80 !== null &&
    state.screenCondition !== null &&
    state.hasNonOriginalParts !== null

  return (
    <Card>
      <CardHeader
        title={t('step2Title')}
        subtitle={t('step2Subtitle')}
      />

      <div className="space-y-4">
        <Select
          label={lang === 'es' ? 'Salud de batería' : 'Battery health'}
          placeholder={lang === 'es' ? 'Seleccioná el estado...' : 'Select status...'}
          options={batteryOptions}
          value={batteryValue}
          onChange={(val) => setBattery(val === 'bad')}
        />

        <Select
          label={lang === 'es' ? 'Estado de pantalla' : 'Screen condition'}
          placeholder={lang === 'es' ? 'Seleccioná el estado...' : 'Select condition...'}
          options={screenOptions}
          value={state.screenCondition ?? undefined}
          onChange={(val) => setScreen(val as ScreenCondition)}
        />

        <Select
          label={lang === 'es' ? 'Piezas originales' : 'Original parts'}
          placeholder={lang === 'es' ? 'Seleccioná...' : 'Select...'}
          options={partsOptions}
          value={partsValue}
          onChange={(val) => setOriginalParts(val === 'non-original')}
        />
      </div>

      <Button onClick={nextStep} fullWidth disabled={!canContinue} className="mt-6">
        {t('continue')}
      </Button>
    </Card>
  )
}
