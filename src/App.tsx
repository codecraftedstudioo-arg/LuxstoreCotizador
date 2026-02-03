import { Wizard } from '@/features/wizard'
import { I18nProvider } from '@/lib/i18n'

function App() {
  return (
    <I18nProvider>
      <Wizard />
    </I18nProvider>
  )
}

export default App
