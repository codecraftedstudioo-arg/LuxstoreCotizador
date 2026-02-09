import { Card, CardHeader, Button, ToggleCard } from '@/components/ui'
import { useWizard } from '../hooks/use-wizard'
import { useI18n } from '@/lib/i18n'

// Icons
const BatteryFullIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M.75 9.75a3 3 0 013-3h15a3 3 0 013 3v.038c.856.173 1.5.93 1.5 1.837v2.25c0 .907-.644 1.664-1.5 1.838v.037a3 3 0 01-3 3h-15a3 3 0 01-3-3v-6zm19.5 0a1.5 1.5 0 00-1.5-1.5h-15a1.5 1.5 0 00-1.5 1.5v6a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5v-6z" clipRule="evenodd" />
    <path d="M4.5 10.5h12v3h-12v-3z" />
  </svg>
)

const BatteryLowIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M.75 9.75a3 3 0 013-3h15a3 3 0 013 3v.038c.856.173 1.5.93 1.5 1.837v2.25c0 .907-.644 1.664-1.5 1.838v.037a3 3 0 01-3 3h-15a3 3 0 01-3-3v-6zm19.5 0a1.5 1.5 0 00-1.5-1.5h-15a1.5 1.5 0 00-1.5 1.5v6a1.5 1.5 0 001.5 1.5h15a1.5 1.5 0 001.5-1.5v-6z" clipRule="evenodd" />
    <path d="M4.5 10.5h4v3h-4v-3z" />
  </svg>
)

const OriginalIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
)

const ReplacedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
)

/**
 * Step 3: Battery health + Original parts
 * Visual cards with icons
 */
export function Step3Details() {
  const { state, setBatteryHealth, setOriginalParts, nextStep } = useWizard()
  const { t, lang } = useI18n()

  const canContinue = state.batteryHealth !== null

  return (
    <Card>
      <CardHeader
        title={t('step3Title')}
        subtitle={lang === 'es' ? 'Información de batería y piezas' : 'Battery and parts info'}
      />

      <div className="space-y-6">
        {/* Battery Health */}
        <div className="space-y-3">
          <p className="text-sm text-white/50 font-medium">
            {lang === 'es' ? 'Salud de batería' : 'Battery health'}
          </p>
          <p className="text-xs text-white/40">
            {lang === 'es'
              ? 'Ajustes → Batería → Estado de la batería'
              : 'Settings → Battery → Battery Health'}
          </p>
          <div className="flex gap-3">
            <ToggleCard
              selected={state.batteryHealth === 'good'}
              onClick={() => setBatteryHealth('good')}
              icon={<BatteryFullIcon />}
              label={lang === 'es' ? '85% o más' : '85% or more'}
              neutral={true}
            />
            <ToggleCard
              selected={state.batteryHealth === 'low'}
              onClick={() => setBatteryHealth('low')}
              icon={<BatteryLowIcon />}
              label={lang === 'es' ? 'Menos de 85%' : 'Below 85%'}
              neutral={true}
            />
          </div>
        </div>

        {/* Original Screen */}
        <div className="space-y-3">
          <p className="text-sm text-white/50 font-medium">
            {lang === 'es' ? '¿Pantalla original de Apple?' : 'Original Apple screen?'}
          </p>
          <div className="flex gap-3">
            <ToggleCard
              selected={state.originalParts.screen === true}
              onClick={() => setOriginalParts({ screen: true })}
              icon={<OriginalIcon />}
              label={lang === 'es' ? 'Original' : 'Original'}
              neutral={true}
            />
            <ToggleCard
              selected={state.originalParts.screen === false}
              onClick={() => setOriginalParts({ screen: false })}
              icon={<ReplacedIcon />}
              label={lang === 'es' ? 'Cambiada' : 'Replaced'}
              neutral={true}
            />
          </div>
        </div>

        {/* Original Battery */}
        <div className="space-y-3">
          <p className="text-sm text-white/50 font-medium">
            {lang === 'es' ? '¿Batería original de Apple?' : 'Original Apple battery?'}
          </p>
          <div className="flex gap-3">
            <ToggleCard
              selected={state.originalParts.battery === true}
              onClick={() => setOriginalParts({ battery: true })}
              icon={<OriginalIcon />}
              label={lang === 'es' ? 'Original' : 'Original'}
              neutral={true}
            />
            <ToggleCard
              selected={state.originalParts.battery === false}
              onClick={() => setOriginalParts({ battery: false })}
              icon={<ReplacedIcon />}
              label={lang === 'es' ? 'Cambiada' : 'Replaced'}
              neutral={true}
            />
          </div>
        </div>
      </div>

      <Button onClick={nextStep} fullWidth disabled={!canContinue} className="mt-6">
        {t('continue')}
      </Button>
    </Card>
  )
}
