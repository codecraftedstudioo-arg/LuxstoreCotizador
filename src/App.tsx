import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { I18nProvider } from '@/lib/i18n'
import { WizardProvider } from '@/features/wizard/hooks/use-wizard'
import { WizardPage } from '@/features/wizard/wizard'
import { AdminApp } from '@/features/admin/AdminApp'
import { fetchExchangeRate } from '@/lib/exchange-rate'
import { fetchMarketPrices } from '@/lib/market-api'
import { initPricingConfig } from '@/lib/pricing-source'

fetchExchangeRate()
fetchMarketPrices().catch(() => { /* hook se encarga de reintentar */ })
initPricingConfig()

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route
          path="/"
          element={
            <I18nProvider>
              <WizardProvider>
                <WizardPage />
              </WizardProvider>
            </I18nProvider>
          }
        />
        <Route path="/cotizar" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
