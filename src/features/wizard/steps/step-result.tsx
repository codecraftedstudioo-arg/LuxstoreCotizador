import { useState } from 'react'
import { Card, Button } from '@/components/ui'
import { useWizard } from '../hooks/use-wizard'
import { useI18n } from '@/lib/i18n'
import { calculatePrice, formatPrice } from '@/lib/pricing-engine'
import { buildWhatsAppLink, buildInquiryLink } from '@/lib/whatsapp-builder'
import { useExchangeRate } from '@/lib/use-exchange-rate'

/**
 * Final step: Show price or blocked message
 */
export function StepResult() {
  const { state, reset } = useWizard()
  const { t, lang } = useI18n()
  const priceResult = calculatePrice(state)
  const { rate } = useExchangeRate()

  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 15)
    setContactPhone(value)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.-]/g, '').slice(0, 50)
    setContactName(value)
  }

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

  const whatsappLink = buildWhatsAppLink(state, priceResult, undefined, lang, rate)

  return (
    <Card className="text-center">
      <Confetti />

      {/* Sticky price header */}
      <div className="sticky top-0 z-10 bg-black -mx-3 px-3 -mt-2 pt-6 pb-4 mb-4 border-b border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
        <p className="text-white/70 text-sm mb-1">
          {lang === 'es' ? `Tu ${state.model} ${state.storage ? (state.storage === '1024' ? '1 TB' : state.storage + ' GB') : ''} vale` : `Your ${state.model} ${state.storage ? (state.storage === '1024' ? '1 TB' : state.storage + ' GB') : ''} is worth`}
        </p>
        <p className="text-3xl sm:text-4xl font-black text-white tracking-tight animate-countUp">
          {formatPrice(priceResult.finalPrice)}
        </p>
        <p className="text-white/50 text-sm mt-1">
          {lang === 'es'
            ? `Equivale a $${(priceResult.finalPrice * rate).toLocaleString('es-AR')} ARS`
            : `Equivalent to $${(priceResult.finalPrice * rate).toLocaleString('en-US')} ARS`}
        </p>
        <p className="text-white/40 text-xs mt-1">{t('resultDisclaimer')}</p>
      </div>

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

      {/* Main CTA - Vender mi iPhone */}
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
        <button className="w-full px-6 py-4 bg-green-500 hover:bg-green-600 text-white font-semibold text-lg rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-500/20">
          <WhatsAppIcon />
          {lang === 'es' ? '¡Vender mi iPhone!' : 'Sell my iPhone!'}
        </button>
      </a>

      <p className="text-center text-white/40 text-xs mt-3">
        {lang === 'es'
          ? 'Te responderemos en minutos por WhatsApp'
          : 'We\'ll reply within minutes on WhatsApp'}
      </p>

      {/* Inquiry section */}
      <div className="mt-6 p-4 bg-white/5 rounded-xl text-left border border-white/10">
        <p className="text-sm font-medium text-white mb-1">
          {lang === 'es' ? '¿Tenés dudas? Te contactamos sin compromiso.' : 'Any questions? We\'ll contact you, no commitment.'}
        </p>
        <p className="text-xs text-white/40 mb-3">
          {t('optional')}
        </p>
        <div className="space-y-3">
          <input
            type="text"
            placeholder={t('yourName')}
            value={contactName}
            onChange={handleNameChange}
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white"
          />
          <input
            type="tel"
            inputMode="numeric"
            placeholder={t('yourPhone')}
            value={contactPhone}
            onChange={handlePhoneChange}
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-white"
          />
          <a
            href={buildInquiryLink(state, priceResult, { name: contactName || undefined, phone: contactPhone || undefined }, lang, rate)}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <button className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl transition-all flex items-center justify-center gap-2 border border-white/20">
              <WhatsAppIcon />
              {lang === 'es' ? 'Consultar por WhatsApp' : 'Ask via WhatsApp'}
            </button>
          </a>
        </div>
      </div>

      <button
        onClick={reset}
        className="mt-4 w-full py-3 text-sm font-medium text-white bg-[#4A6BDB] hover:bg-[#3A5BCB] rounded-xl transition-all"
      >
        {t('quoteAnother')}
      </button>

    </Card>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
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
