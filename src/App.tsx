import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { I18nProvider } from '@/lib/i18n'
import { WizardProvider } from '@/features/wizard/hooks/use-wizard'
import { IntroScreen } from '@/features/wizard/components/intro-screen'
import { WizardPage } from '@/features/wizard/wizard'
import { AdminApp } from '@/features/admin/AdminApp'
import { fetchExchangeRate } from '@/lib/exchange-rate'
import { fetchMarketPrices } from '@/lib/market-api'
import { initPricingConfig } from '@/lib/pricing-source'

// Prefetch data while user is on the landing page
fetchExchangeRate()
fetchMarketPrices().catch(() => { /* hook se encarga de reintentar */ })
initPricingConfig()

function App() {
  return (
    <BrowserRouter>
      <I18nProvider>
        <WizardProvider>
          <Routes>
            <Route path="/admin/*" element={<AdminApp />} />
            <Route path="/" element={<IntroScreen />} />
            <Route path="/cotizar" element={<WizardPage />} />
          </Routes>
        </WizardProvider>
      </I18nProvider>
    </BrowserRouter>
  )
}

export default App
