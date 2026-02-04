import { Card, CardHeader, Button, ToggleCard } from '@/components/ui'
import { useWizard } from '../hooks/use-wizard'
import { useI18n } from '@/lib/i18n'

// Icons
const CloudCheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496zM15.22 11.47a.75.75 0 10-1.06 1.06l-2.47 2.47-1.47-1.47a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l3-3z" clipRule="evenodd" />
  </svg>
)

const CloudXIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496zM9.22 11.47a.75.75 0 10-1.06 1.06L10.94 15l-2.78 2.78a.75.75 0 101.06 1.06L12 16.06l2.78 2.78a.75.75 0 101.06-1.06L13.06 15l2.78-2.78a.75.75 0 00-1.06-1.06L12 13.94l-2.78-2.78z" clipRule="evenodd" />
  </svg>
)

/**
 * Step 5: iCloud / Find My iPhone check
 * If locked, quote is blocked
 */
export function Step5ICloud() {
  const { state, setICloud, nextStep } = useWizard()
  const { lang } = useI18n()

  // Only allow to continue if iCloud is OFF (can sell)
  const canContinue = state.iCloudOff === true

  return (
    <Card>
      <CardHeader
        title={lang === 'es' ? '¿iCloud está desactivado?' : 'Is iCloud off?'}
        subtitle={lang === 'es'
          ? 'Necesitamos que esté desactivado para comprarlo'
          : 'It needs to be off for us to buy it'}
      />

      {/* Warning info box */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl mb-6">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1 text-sm">
            <p className="font-medium text-amber-200 mb-1">
              {lang === 'es' ? 'Cómo verificar:' : 'How to verify:'}
            </p>
            <p className="text-amber-200/80">
              {lang === 'es'
                ? 'Ajustes → Tu nombre → Buscar → Buscar mi iPhone debe estar APAGADO'
                : 'Settings → Your Name → Find My → Find My iPhone must be OFF'}
            </p>
          </div>
        </div>
      </div>

      {/* Toggle selection */}
      <div className="space-y-3">
        <p className="text-sm text-white/50 font-medium">
          {lang === 'es' ? '¿Buscar mi iPhone está desactivado?' : 'Is Find My iPhone off?'}
        </p>
        <div className="flex gap-3">
          <ToggleCard
            selected={state.iCloudOff === true}
            onClick={() => setICloud(true)}
            icon={<CloudCheckIcon />}
            label={lang === 'es' ? 'Sí, desactivado' : 'Yes, it\'s off'}
            isPositive={true}
          />
          <ToggleCard
            selected={state.iCloudOff === false}
            onClick={() => setICloud(false)}
            icon={<CloudXIcon />}
            label={lang === 'es' ? 'No / No sé' : 'No / Not sure'}
            isPositive={false}
          />
        </div>
      </div>

      {/* Status feedback */}
      {state.iCloudOff !== null && (
        <div className={`
          mt-4 p-3 rounded-xl text-sm animate-fadeSlideIn
          ${state.iCloudOff
            ? 'bg-green-500/10 border border-green-500/30 text-green-200'
            : 'bg-red-500/10 border border-red-500/30 text-red-200'
          }
        `}>
          {state.iCloudOff
            ? (lang === 'es'
                ? '✓ Perfecto, tu iPhone puede ser cotizado'
                : '✓ Perfect, your iPhone can be quoted')
            : (lang === 'es'
                ? '⚠️ iCloud debe estar desactivado para poder comprarlo. Desactivalo y volvé a intentar.'
                : '⚠️ iCloud must be off for us to buy it. Turn it off and try again.')
          }
        </div>
      )}

      <Button onClick={nextStep} fullWidth disabled={!canContinue} className="mt-6">
        {lang === 'es' ? 'Ver cotización' : 'Get quote'}
      </Button>
    </Card>
  )
}
