import { useTheme } from '@/lib/use-theme'
import { useI18n } from '@/lib/i18n'

/**
 * Header with Luxstore logo and language toggle
 */
export function Header() {
  const { lang, setLang } = useI18n()
  const { isDark } = useTheme()

  return (
    <header className="w-full py-3 px-4">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <a href="/" className="block hover:opacity-80 transition-opacity">
          <img
            src={isDark ? '/luxstore-logo.png' : '/luxstore-logo-light.png'}
            alt="Luxstore"
            className="h-10 w-auto object-contain rounded-md"
          />
        </a>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
            className="
              px-3 py-2 rounded-xl
              bg-white/10 backdrop-blur-md
              border border-white/20
              text-sm text-white font-medium
              hover:bg-white/20
              transition-all duration-300
              flex items-center gap-1.5
            "
            title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
          >
            <span className="text-base">🌐</span>
            <span className="uppercase">{lang === 'es' ? 'EN' : 'ES'}</span>
          </button>

          <a
            href="/cotizar"
            className="
              px-4 py-2 rounded-xl
              bg-white/10 backdrop-blur-md
              border border-white/20
              text-sm text-white font-medium
              hover:bg-white/20
              transition-all duration-300
              flex items-center gap-2
            "
          >
            {lang === 'es' ? 'Cotizar ahora' : 'Get a quote'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  )
}
