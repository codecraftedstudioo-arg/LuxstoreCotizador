import { Card, Button } from '@/components/ui'
import { useWizard } from '../hooks/use-wizard'
import { useI18n } from '@/lib/i18n'
import { calculatePrice, formatPrice, formatStorage } from '@/lib/pricing-engine'
import { buildWhatsAppLink, buildInquiryLink } from '@/lib/whatsapp-builder'
import type { UpgradeInfo } from '@/features/wizard/types'
import { useExchangeRate } from '@/lib/use-exchange-rate'
import { useMarketPrices } from '@/lib/use-market-prices'
import { getAlternatives, shouldShowAlternatives, type Alternative } from '@/lib/alternatives'
import { getColorName } from '@/config/colors'

/**
 * Final step: Show price or blocked message
 */
export function StepResult() {
  const { state, reset, setUpgradeModel, setUpgradeStorage, setUpgradeColor, setUpgradePrice } = useWizard()
  const { t, lang } = useI18n()
  const priceResult = calculatePrice(state)
  const { rate } = useExchangeRate()
  const { models: marketModels } = useMarketPrices()
  const contactName = state.contactName ?? ''
  // El state guarda los 10 dígitos locales; agrego prefijo +54 9 para mostrar
  const rawPhone = state.contactPhone ?? ''
  const contactPhone = rawPhone.length === 10 ? `+54 9 ${rawPhone}` : rawPhone

  // Build upgrade info from wizard state
  const upgradeInfo: UpgradeInfo | undefined =
    state.upgradeModel && state.upgradeStorage && state.upgradeColor && state.upgradePrice
      ? { model: state.upgradeModel, storage: state.upgradeStorage, color: state.upgradeColor, price: state.upgradePrice }
      : undefined

  // Blocked by iCloud
  if (priceResult?.blocked) {
    return (
      <Card className="text-center">
        <div className="py-8">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            {lang === 'es' ? 'No podemos cotizar este iPhone' : 'We cannot quote this iPhone'}
          </h2>
          <p className="text-white/70 mb-6">
            {lang === 'es'
              ? 'El iPhone tiene iCloud / Buscar mi iPhone activado. Necesitamos que lo desactives para poder comprarlo.'
              : 'The iPhone has iCloud / Find My iPhone enabled. You need to disable it for us to buy it.'}
          </p>
          <div className="p-4 bg-white/5 rounded-xl text-left mb-6">
            <p className="text-sm text-white/80">
              {lang === 'es'
                ? '📱 Para desactivar: Ajustes → Tu nombre → Buscar → Buscar mi iPhone → Desactivar'
                : '📱 To disable: Settings → Your Name → Find My → Find My iPhone → Turn Off'}
            </p>
          </div>
          <Button onClick={reset} fullWidth>
            {t('quoteAnother')}
          </Button>
        </div>
      </Card>
    )
  }

  // Error calculating
  if (!priceResult || !state.model) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-gray-300">
            {lang === 'es' ? 'Error al calcular el precio' : 'Error calculating price'}
          </p>
          <Button onClick={reset} className="mt-4">
            {lang === 'es' ? 'Volver a empezar' : 'Start over'}
          </Button>
        </div>
      </Card>
    )
  }

  const contactInfo = (contactName || contactPhone)
    ? { name: contactName || undefined, phone: contactPhone || undefined }
    : undefined
  const whatsappLink = buildWhatsAppLink(state, priceResult, contactInfo, lang, rate ?? 0, upgradeInfo)
  const diff = upgradeInfo ? upgradeInfo.price - priceResult.finalPrice : 0
  const upgradeCovers = upgradeInfo && diff <= 0

  // Calcular alternativas si es canje y la diferencia es alta
  const alternatives: Alternative[] = upgradeInfo && state.model && !upgradeCovers && shouldShowAlternatives(diff)
    ? getAlternatives({
        marketModels,
        currentModel: state.model,
        selectedModel: upgradeInfo.model,
        selectedPrice: upgradeInfo.price,
        tradeInValue: priceResult.finalPrice,
      })
    : []

  const handleSelectAlternative = (alt: Alternative) => {
    setUpgradeModel(alt.model)
    setUpgradeStorage(alt.storage)
    setUpgradeColor(alt.color)
    setUpgradePrice(alt.price)
    // Scroll arriba para que vea el nuevo precio
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <Card className="text-center">
      <Confetti />

      {upgradeInfo ? (
        <>
          {/* Upgrade flow */}
          <div className="mb-4 space-y-3 text-center">
            {/* Your iPhone value */}
            <div className="p-4 min-h-[5rem] flex flex-col justify-center bg-green-500/10 rounded-xl border border-green-500/20">
              <p className="text-green-300/60 text-xs">
                {lang === 'es' ? `Tu ${state.model} ${formatStorage(state.storage ?? '')} vale` : `Your ${state.model} ${formatStorage(state.storage ?? '')} is worth`}
              </p>
              <p className="text-lg font-bold text-green-400 mt-0.5">{formatPrice(priceResult.finalPrice)}</p>
            </div>

            {/* New iPhone price */}
            <div className="p-4 min-h-[5rem] flex flex-col justify-center bg-blue-500/10 rounded-xl border border-blue-500/20">
              <p className="text-blue-300/60 text-xs">{upgradeInfo.model} {formatStorage(upgradeInfo.storage)}</p>
              <p className="text-lg font-bold text-blue-300 mt-0.5">{formatPrice(upgradeInfo.price)}</p>
            </div>

            {/* Difference */}
            <div className="p-4 min-h-[5rem] flex flex-col justify-center bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/15">
              <p className="text-white/50 text-xs">
                {upgradeCovers
                  ? (lang === 'es' ? 'Te queda a favor' : 'In your favor')
                  : (lang === 'es' ? 'Diferencia a pagar' : 'Difference to pay')}
              </p>
              <p className="text-2xl font-black text-white mt-1 animate-countUp">
                {formatPrice(Math.abs(diff))}
              </p>
              {rate !== null && Math.abs(diff) > 0 && (
                <p className="text-lg font-bold text-white/70 mt-1">
                  {(Math.abs(diff) * rate).toLocaleString('es-AR')} ARS
                </p>
              )}
            </div>

            <p className="text-white/30 text-xs">{t('resultDisclaimer')}</p>
          </div>

          {/* Recomendador de alternativas — solo si la diferencia es alta */}
          {alternatives.length > 0 && (
            <div className="mb-4 space-y-3 animate-fadeSlideIn">
              <div className="text-left">
                <p className="text-sm font-semibold text-white">
                  {lang === 'es' ? '¿Diferencia muy alta?' : 'Difference too high?'}
                </p>
                <p className="text-xs text-white/50 mt-0.5">
                  {lang === 'es'
                    ? 'Mirá estas alternativas con menor diferencia a pagar:'
                    : 'Check these alternatives with lower difference:'}
                </p>
              </div>

              <div className="space-y-2">
                {alternatives.map((alt) => {
                  const colorName = alt.color ? getColorName(alt.color, lang) : ''
                  return (
                    <button
                      key={`${alt.model}-${alt.storage}-${alt.color}`}
                      onClick={() => handleSelectAlternative(alt)}
                      className="w-full p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-green-500/10 hover:border-green-500/40 transition-all text-left group"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">
                            {alt.model} {formatStorage(alt.storage)}
                          </p>
                          {colorName && (
                            <p className="text-xs text-white/40 mt-0.5">{colorName}</p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs text-white/50">
                            {lang === 'es' ? 'Diferencia' : 'Difference'}
                          </p>
                          <p className="text-sm font-bold text-green-400 group-hover:text-green-300">
                            {formatPrice(alt.newDiff)}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Sell-only flow: sticky header */}
          <div className="sticky top-0 z-10 bg-black -mx-3 px-3 -mt-2 pt-6 pb-4 mb-4 border-b border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.8)] text-center">
            <p className="text-white/70 text-sm mb-1">
              {lang === 'es' ? `Tu ${state.model} de ${formatStorage(state.storage ?? '')} vale` : `Your ${state.model} ${formatStorage(state.storage ?? '')} is worth`}
            </p>
            <p className="text-3xl sm:text-4xl font-black text-white tracking-tight animate-countUp">
              {formatPrice(priceResult.finalPrice)}
            </p>
            {rate !== null && (
              <p className="text-xl sm:text-2xl font-bold text-white/80 mt-1">
                {(priceResult.finalPrice * rate).toLocaleString('es-AR')} ARS
              </p>
            )}
            <p className="text-white/40 text-xs mt-1">{t('resultDisclaimer')}</p>
          </div>
        </>
      )}


      {/* Deductions breakdown */}
      {priceResult.deductionBreakdown.length > 0 && (
        <div className="mb-4 p-4 bg-white/5 rounded-xl text-left border border-white/10">
          <p className="text-sm font-medium text-white mb-3">{t('adjustments')}</p>
          <ul className="space-y-2">
            {priceResult.deductionBreakdown.map((d, i) => (
              <li key={i} className="text-sm flex justify-between items-center">
                <span className="text-white/80">{t(d.reason as any)}</span>
                <span className="text-white font-medium">-{formatPrice(d.amount)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main CTA — changes text based on upgrade */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        onClick={(e) => {
          e.preventDefault()
          window.fbq?.('track', 'Contact')
          setTimeout(() => window.open(whatsappLink, '_blank', 'noopener,noreferrer'), 300)
        }}
      >
        <button className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2">
          <WhatsAppIcon />
          {upgradeInfo
            ? (lang === 'es' ? '¡Quiero canjear!' : 'I want to trade in!')
            : (lang === 'es' ? '¡Vender mi iPhone!' : 'Sell my iPhone!')}
        </button>
      </a>

      <p className="text-center text-white/40 text-xs mt-3">
        {lang === 'es'
          ? 'Te responderemos en minutos por WhatsApp'
          : 'We\'ll reply within minutes on WhatsApp'}
      </p>

      {/* Inquiry — usa contacto del paso anterior */}
      <a
        href={buildInquiryLink(state, priceResult, { name: contactName || undefined, phone: contactPhone || undefined }, lang, rate ?? 0, upgradeInfo)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => { window.fbq?.('track', 'Contact') }}
        className="mt-3 block w-full text-center px-4 py-3 text-sm font-semibold text-white/60 hover:text-white/80 border border-white/15 hover:border-white/25 rounded-xl transition-all"
      >
        {lang === 'es' ? '¿Tenés dudas? Consultanos' : 'Questions? Ask us'}
      </a>

      <button
        onClick={reset}
        className="mt-4 flex items-center justify-center gap-1.5 text-white/40 hover:text-white/60 text-xs transition-colors mx-auto underline underline-offset-2 decoration-white/20 hover:decoration-white/40"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        {upgradeInfo
          ? (lang === 'es' ? 'Cotizar otro iPhone' : 'Quote another iPhone')
          : t('quoteAnother')}
      </button>

    </Card>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

const Confetti = (() => {
  // Colores tipo piñata/fiesta
  const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#A8D8EA', '#FF9F43', '#6BCB77']
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.5}s`,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 10 + 5,
    isRound: Math.random() > 0.5,
  }))

  return function ConfettiComponent() {
    return (
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden animate-confetti-container">
        {pieces.map((piece) => (
          <div
            key={piece.id}
            className="confetti-piece"
            style={{
              left: piece.left,
              animationDelay: piece.delay,
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              borderRadius: piece.isRound ? '50%' : '0',
            }}
          />
        ))}
      </div>
    )
  }
})()
