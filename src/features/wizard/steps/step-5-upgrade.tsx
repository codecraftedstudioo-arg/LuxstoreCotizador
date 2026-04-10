import { useState } from 'react'
import { Card, CardHeader, Button, Select, StoragePill } from '@/components/ui'
import { useWizard } from '../hooks/use-wizard'
import { useI18n } from '@/lib/i18n'
import { useMarketPrices } from '@/lib/use-market-prices'
import { formatPrice, formatStorage } from '@/lib/pricing-engine'
import { colorMap, getColorName } from '@/config/colors'
import type { Model } from '@/types/market'

const MARKET_URL = 'https://electronicpoint-iphonemarket.com.ar/'
export function Step5Upgrade() {
  const { state, setUpgradeModel, setUpgradeStorage, setUpgradeColor, setUpgradePrice, clearUpgrade, nextStep } = useWizard()
  const { t, lang } = useI18n()
  const { models: marketModels } = useMarketPrices()
  const [wantsUpgrade, setWantsUpgrade] = useState<boolean>(
    state.upgradeModel !== null
  )

  const selectedMarketModel: Model | undefined = marketModels.find((m) => m.name === state.upgradeModel)

  const marketModelOptions = marketModels
    .filter((m) => m.variants.some((v) => v.inStock !== false && v.priceUSD > 0))
    .map((m) => ({ value: m.name, label: m.name }))

  const upgradeStorageOptions = selectedMarketModel
    ? [...new Set(
        selectedMarketModel.variants
          .filter((v) => v.inStock !== false && v.priceUSD > 0)
          .map((v) => v.storage)
      )]
    : []

  const upgradeColorOptions = selectedMarketModel && state.upgradeStorage
    ? selectedMarketModel.variants
        .filter((v) => v.storage === state.upgradeStorage && v.inStock !== false && v.priceUSD > 0)
        .map((v) => ({ color: v.color || 'Black', price: v.priceUSD }))
    : []

  const handleJustSell = () => {
    clearUpgrade()
    nextStep()
  }

  const handleWantsUpgrade = () => setWantsUpgrade(true)

  return (
    <Card>
      <CardHeader
        title={lang === 'es' ? '¿Qué querés hacer?' : 'What do you want to do?'}
        subtitle={lang === 'es' ? 'Podés vender tu iPhone o canjearlo por uno nuevo' : 'You can sell your iPhone or trade it in for a new one'}
      />

      {/* Initial choice — Plan Canje destacado + sell estándar */}
      {!wantsUpgrade && (
        <div className="space-y-3">
          {/* Plan Canje — primary, destacado */}
          <button
            type="button"
            onClick={handleWantsUpgrade}
            className="relative w-full p-5 rounded-xl border-2 border-[#4A6BDB] bg-gradient-to-br from-[#4A6BDB]/20 to-[#4A6BDB]/5 hover:border-[#6B8AED] hover:from-[#4A6BDB]/30 hover:to-[#4A6BDB]/10 transition-all text-left group shadow-[0_0_40px_-8px_rgba(74,107,219,0.6)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4A6BDB]/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-[#6B8AED]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M21 12a9 9 0 0 0-15-6.7L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" />
                  <path d="M16 16h5v5" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-lg font-bold text-white group-hover:text-[#6B8AED] transition-colors">
                  {lang === 'es' ? 'Plan Canje' : 'Trade-in Plan'}
                </p>
                <p className="text-xs text-white/60 mt-0.5">
                  {lang === 'es' ? 'Usá tu iPhone como parte de pago por uno nuevo' : 'Use your iPhone as part payment for a new one'}
                </p>
              </div>
              <svg className="w-5 h-5 text-[#6B8AED] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          {/* Solo vender — estándar */}
          <button
            type="button"
            onClick={handleJustSell}
            className="w-full p-4 h-20 rounded-xl border-2 border-white/10 bg-white/5 hover:border-green-500/50 hover:bg-green-500/5 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-white group-hover:text-green-300 transition-colors">
                  {lang === 'es' ? 'Solo quiero vender' : 'I just want to sell'}
                </p>
                <p className="text-xs text-white/40 mt-0.5">
                  {lang === 'es' ? 'Ver mi cotización directamente' : 'See my quote directly'}
                </p>
              </div>
            </div>
          </button>

          {/* Market link button */}
          <a
            href={MARKET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 mt-1 py-2.5 w-full rounded-xl border border-white/10 bg-white/5 hover:bg-white/8 text-white/60 hover:text-white/80 text-xs transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {t('upgradeViewAll')}
          </a>
        </div>
      )}

      {/* Upgrade selection form */}
      {wantsUpgrade && (
        <div className="space-y-4 animate-fadeSlideIn">
          {/* Back to choice */}
          <button
            type="button"
            onClick={() => { setWantsUpgrade(false); clearUpgrade() }}
            className="flex items-center gap-1 text-sm text-white/40 hover:text-white/60 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {lang === 'es' ? 'Volver' : 'Back'}
          </button>

          {/* Market Model Select */}
          <Select
            label={lang === 'es' ? '¿Qué modelo querés?' : 'Which model do you want?'}
            placeholder={t('upgradeSelectModel')}
            options={marketModelOptions}
            value={state.upgradeModel ?? undefined}
            onChange={setUpgradeModel}
          />

          {/* Storage Pills */}
          {state.upgradeModel && upgradeStorageOptions.length > 0 && (
            <div className="space-y-2 animate-fadeSlideIn">
              <p className="text-sm text-white/50 font-medium">{t('upgradeStorage')}</p>
              <div className="flex flex-wrap gap-2">
                {upgradeStorageOptions.map((storage) => (
                  <StoragePill
                    key={storage}
                    value={storage}
                    selected={state.upgradeStorage === storage}
                    onClick={() => setUpgradeStorage(storage)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Color Selection */}
          {state.upgradeStorage && upgradeColorOptions.length > 0 && (
            <div className="space-y-2 animate-fadeSlideIn">
              <p className="text-sm text-white/50 font-medium">{t('upgradeColor')}</p>
              <div className="flex flex-wrap gap-2">
                {upgradeColorOptions.map(({ color, price }) => {
                  const displayName = getColorName(color, lang)
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => {
                        setUpgradeColor(color)
                        setUpgradePrice(price)
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-sm ${
                        state.upgradeColor === color
                          ? 'border-white bg-white/10 text-white'
                          : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0"
                        style={{ backgroundColor: colorMap[color] || '#888' }}
                      />
                      {displayName}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Price summary */}
          {state.upgradePrice !== null && (
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 animate-fadeSlideIn text-center">
              <p className="text-sm text-white/70">
                {state.upgradeModel} {formatStorage(state.upgradeStorage!)} · {getColorName(state.upgradeColor!, lang)}
              </p>
              <p className="text-lg font-bold text-white mt-1">{formatPrice(state.upgradePrice)}</p>
            </div>
          )}

          {/* Continue button */}
          {state.upgradePrice !== null && (
            <div className="pt-2">
              <Button onClick={nextStep} fullWidth>
                {lang === 'es' ? 'Continuar' : 'Continue'}
              </Button>
            </div>
          )}

          {/* Market link */}
          <a
            href={MARKET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 text-xs text-white/30 hover:text-white/50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {t('upgradeViewAll')}
          </a>
        </div>
      )}
    </Card>
  )
}
