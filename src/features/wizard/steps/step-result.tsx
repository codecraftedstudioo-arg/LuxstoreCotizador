import { useState } from 'react'
import { Card, Button } from '@/components/ui'
import { useWizard } from '../hooks/use-wizard'
import { useI18n } from '@/lib/i18n'
import { calculatePrice, formatPrice } from '@/lib/pricing-engine'
import { buildWhatsAppLink, buildMessage } from '@/lib/whatsapp-builder'

/**
 * Final step: Show price and WhatsApp button
 * Paleta blanco y negro
 */
export function StepResult() {
  const { state, reset } = useWizard()
  const { t, lang } = useI18n()
  const priceResult = calculatePrice(state)

  // Contact info (optional)
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  // Handler para solo permitir números en teléfono
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '') // Solo dígitos
    setContactPhone(value)
  }

  if (!priceResult || !state.model) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-gray-300">{lang === 'es' ? 'Error al calcular el precio' : 'Error calculating price'}</p>
          <Button onClick={reset} className="mt-4">
            {lang === 'es' ? 'Volver a empezar' : 'Start over'}
          </Button>
        </div>
      </Card>
    )
  }

  const whatsappLink = buildWhatsAppLink(state, priceResult, {
    name: contactName || undefined,
    phone: contactPhone || undefined,
  }, lang)

  const messagePreview = buildMessage(state, priceResult, {
    name: contactName || undefined,
    phone: contactPhone || undefined,
  }, lang)

  return (
    <Card className="text-center">
      {/* Confetti - CSS only, no re-render */}
      <Confetti />

      <div className="mb-8 py-6 border-b border-white/10">
        <p className="text-white/70 mb-3">{t('resultTitle', { model: state.model.name })}</p>
        <p className="text-6xl lg:text-7xl font-black text-white tracking-tight animate-countUp">
          {formatPrice(priceResult.finalPrice)}
        </p>
        <p className="text-white/50 text-sm mt-2">{t('resultDisclaimer')}</p>
      </div>

      {/* Desglose de deducciones */}
      {priceResult.deductionBreakdown.length > 0 && (
        <div className="mb-6 p-4 bg-white/5 rounded-xl text-left border border-white/10">
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

      {/* Contact info (optional) */}
      <div className="mb-6 p-4 bg-white/5 rounded-xl text-left border border-white/10">
        <p className="text-sm font-medium text-white mb-3">
          {t('contactInfo')} <span className="text-gray-500">{t('optional')}</span>
        </p>
        <div className="space-y-3">
          <input
            type="text"
            placeholder={t('yourName')}
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
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
        </div>
      </div>

      {/* Preview del mensaje */}
      <div className="mb-4">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="text-sm text-white/60 hover:text-white transition-colors flex items-center gap-1 mx-auto"
        >
          {showPreview ? '▼' : '▶'} {t('previewMessage')}
        </button>
        {showPreview && (
          <div className="mt-3 p-4 bg-white/5 rounded-xl text-left border border-white/10 text-sm text-white/80 whitespace-pre-line">
            {messagePreview}
          </div>
        )}
      </div>

      {/* Botón WhatsApp - blanco y negro */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <button className="w-full px-8 py-4 bg-white text-black font-semibold text-lg rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-3 shadow-lg">
          <WhatsAppIcon />
          {t('contactWhatsApp')}
        </button>
      </a>

      {/* Volver a empezar */}
      <button
        onClick={reset}
        className="mt-4 text-sm text-gray-400 hover:text-white underline transition-colors"
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

/** Confetti burst effect - pure CSS, memoized to prevent re-renders */
const Confetti = (() => {
  const colors = ['#fff', '#ccc', '#888', '#444']
  const pieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.5}s`,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 8 + 4,
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
