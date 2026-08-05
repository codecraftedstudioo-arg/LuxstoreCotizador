import { type ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWizard } from '../hooks/use-wizard'
import { ThemeToggle } from '@/components/theme-toggle'
import { useTheme } from '@/lib/use-theme'

function FAQItem({ question, children }: { question: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      onClick={() => setOpen(!open)}
      className={`w-full text-left rounded-xl transition-all duration-300 px-4 sm:px-5 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6B8AED]/50 group ${
        open
          ? 'bg-fg/[0.04] border border-fg/[0.08] py-4 sm:py-5'
          : 'bg-fg/[0.02] border border-fg/[0.04] hover:bg-fg/[0.05] hover:border-fg/[0.08] py-4 sm:py-5'
      }`}
    >
      {/* Question row */}
      <div className="flex items-center justify-between gap-3">
        <span className={`text-sm sm:text-[15px] font-medium transition-colors duration-200 ${
          open ? 'text-[#4A6BDB] dark:text-[#6B8AED]' : 'text-fg-muted group-hover:text-fg'
        }`}>{question}</span>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
          open ? 'bg-[#4A6BDB]/15 dark:bg-[#6B8AED]/15 rotate-180' : 'bg-fg/[0.06] group-hover:bg-fg/[0.10]'
        }`}>
          <svg
            className={`w-3.5 h-3.5 transition-colors duration-200 ${open ? 'text-[#4A6BDB] dark:text-[#6B8AED]' : 'text-fg-subtle'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

      {/* Answer content */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
        open ? 'max-h-[500px] opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'
      }`}>
        {children}
      </div>
    </button>
  )
}

export function IntroScreen() {
  const navigate = useNavigate()
  const { reset } = useWizard()
  const { isDark } = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const logoSrc = isDark ? '/luxstore-logo.png' : '/luxstore-logo-light.png'

  const startCotizar = () => {
    reset()
    navigate('/cotizar')
  }

  const heroStats: { value: ReactNode; label: string }[] = [
    { value: '+8.000', label: 'Clientes' },
    { value: <>4.9<span className="text-amber-400 animate-star-twinkle">★</span></>, label: 'Google Reviews' },
    { value: '24hs', label: 'Pago inmediato' },
    { value: '+20', label: 'Años de experiencia' },
  ]

  return (
    <div className="min-h-screen bg-bg">
      {/* Navbar */}
      <nav className="relative z-10 sticky top-0 bg-bg/95 backdrop-blur-xl border-b border-line">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-4 flex items-center justify-between">
          {/* Logo Luxstore */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="block hover:opacity-80 transition-opacity"
          >
            <img
              src={logoSrc}
              alt="Luxstore"
              className="h-9 md:h-10 w-auto object-contain rounded-md"
            />
          </button>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <button
               onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
               className="text-fg-muted hover:text-fg transition-colors text-sm">
              ¿Cómo funciona?
            </button>
            <button
               onClick={() => document.getElementById('preguntas-frecuentes')?.scrollIntoView({ behavior: 'smooth' })}
               className="text-fg-muted hover:text-fg transition-colors text-sm">
              Preguntas frecuentes
            </button>
            <ThemeToggle />
          </div>

          {/* Right cluster - Mobile (toggle + hamburger) */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 rounded-xl bg-bg-subtle border border-line flex flex-col items-center justify-center gap-[5px] hover:bg-fg/5 transition-all cursor-pointer group"
              aria-label="Menú"
            >
              <span className={`block h-[2px] rounded-full bg-fg transition-all duration-300 ${menuOpen ? 'w-5 rotate-45 translate-y-[7px]' : 'w-5 group-hover:w-4'}`} />
              <span className={`block h-[2px] rounded-full bg-fg transition-all duration-300 ${menuOpen ? 'w-0 opacity-0' : 'w-3.5'}`} />
              <span className={`block h-[2px] rounded-full bg-fg transition-all duration-300 ${menuOpen ? 'w-5 -rotate-45 -translate-y-[7px]' : 'w-5 group-hover:w-4'}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-line bg-bg backdrop-blur-xl">
            <div className="px-5 py-5 flex flex-col gap-1">
              <button
                onClick={() => { document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false) }}
                className="flex items-center gap-3 text-fg-muted hover:text-fg hover:bg-fg/5 text-sm text-left py-3 px-3 rounded-xl transition-all cursor-pointer"
              >
                <span className="w-8 h-8 rounded-lg bg-[#4A6BDB]/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#4A6BDB] dark:text-[#6B8AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                  </svg>
                </span>
                ¿Cómo funciona?
              </button>
              <button
                onClick={() => { document.getElementById('preguntas-frecuentes')?.scrollIntoView({ behavior: 'smooth' }); setMenuOpen(false) }}
                className="flex items-center gap-3 text-fg-muted hover:text-fg hover:bg-fg/5 text-sm text-left py-3 px-3 rounded-xl transition-all cursor-pointer"
              >
                <span className="w-8 h-8 rounded-lg bg-[#4A6BDB]/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-[#4A6BDB] dark:text-[#6B8AED]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                  </svg>
                </span>
                Preguntas frecuentes
              </button>

              <div className="h-px bg-line my-2 mx-3" />

              <button
                type="button"
                onClick={() => { setMenuOpen(false); startCotizar() }}
                className="flex items-center justify-center gap-2 mt-1 mx-3 py-3 rounded-xl text-sm font-semibold text-accent-contrast bg-accent hover:bg-accent-hover transition-all"
              >
                Cotizar ahora
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-bg overflow-hidden">
        {/* El titular y los beneficios vienen dentro de la imagen del hero; el h1 se
           mantiene oculto para lectores de pantalla y SEO. */}
        <h1 className="sr-only">Cotiza tu iPhone en 1 minuto — Luxstore</h1>

        {/* Hero — Mobile (banner style: full-bleed photo, CTA anchored bottom) */}
        <div className="md:hidden">
          <div className="relative">
            <img
              src="/hero-desktop.webp"
              alt="Cotiza tu iPhone en 1 minuto: rápido, simple y sin compromiso, 100% seguro y al mejor precio"
              className="w-full h-auto"
            />
            {/* Velo oscuro abajo para que el CTA se lea sobre la foto */}
            <div className="absolute inset-0 bg-[linear-gradient(to_top,#000_0%,rgba(0,0,0,0.75)_12%,transparent_34%)]" />
            {/* CTA anchored bottom */}
            <div className="absolute inset-x-0 bottom-0 px-6 pb-9">
              <button
                onClick={startCotizar}
                className="btn-shimmer inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-[15px] font-semibold text-accent-contrast bg-accent hover:bg-accent-hover active:scale-95 transition-all duration-300 shadow-xl shadow-accent/30 animate-fadeSlideIn"
                style={{ animationDelay: '0.3s' }}
              >
                Cotizar ahora
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </div>
          {/* Stats + location */}
          <div className="px-6 pt-9 pb-10">
            <div className="grid grid-cols-2 gap-6">
              {heroStats.map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl font-bold text-fg">{stat.value}</div>
                  <div className="text-fg-subtle text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
            <p className="mt-7 flex items-center gap-2 text-fg-muted text-sm">
              <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Cotizá online · Pago inmediato</span>
            </p>
          </div>
        </div>

        {/* Hero — Desktop: imagen centrada, CTA y stats debajo */}
        <div className="hidden md:block">
          <div className="flex flex-col items-center px-8 lg:px-12 pt-6 pb-16">
            <div className="animate-fadeSlideIn" style={{ animationDelay: '0.1s' }}>
              <img
                src="/hero-desktop.webp"
                alt="Cotiza tu iPhone en 1 minuto: rápido, simple y sin compromiso, 100% seguro y al mejor precio"
                className="w-auto max-h-[56vh] max-w-[min(100%,420px)] rounded-3xl shadow-2xl shadow-black/30"
              />
            </div>

            <div className="mt-10 animate-fadeSlideIn" style={{ animationDelay: '0.2s' }}>
              <button
                onClick={startCotizar}
                className="btn-shimmer px-10 py-5 rounded-full text-lg font-bold text-accent-contrast bg-accent
                           hover:bg-accent-hover hover:scale-105 transition-all duration-300 shadow-2xl shadow-accent/30 hover:shadow-accent/50"
              >
                Cotizar ahora
              </button>
            </div>

            <div className="mt-12 grid grid-cols-4 gap-10 lg:gap-16 animate-fadeSlideIn" style={{ animationDelay: '0.3s' }}>
              {heroStats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl lg:text-3xl font-bold text-fg">{stat.value}</div>
                  <div className="text-fg-subtle text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - How it works */}
      <section id="como-funciona" className="relative z-10 border-t border-line bg-bg py-16 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-fg text-center mb-12">
            ¿Cómo funciona?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Revisamos el equipo', desc: 'En el local verificamos el estado de tu iPhone' },
              { step: '2', title: 'Confirmamos el precio', desc: 'Te damos el precio final sin sorpresas' },
              { step: '3', title: 'Te pagamos en el momento', desc: 'Efectivo o transferencia, como prefieras' },
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="w-14 h-14 rounded-full bg-surface dark:bg-white/5 border-2 border-[#263A99]/60 flex items-center justify-center mx-auto mb-4 group-hover:border-[#263A99] group-hover:scale-110 transition-all duration-300">
                  <span className="text-2xl font-bold text-[#4A6BDB]">{item.step}</span>
                </div>
                <h3 className="text-fg font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-fg-muted text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-fg-subtle text-sm mt-10">
            Simple, directo, sin letra chica.
          </p>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section id="preguntas-frecuentes" className="relative z-10 border-t border-line bg-bg py-16 sm:py-20 scroll-mt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-fg">
              Preguntas frecuentes
            </h2>
            <p className="text-fg-subtle text-sm mt-2">Todo lo que necesitás saber antes de vender tu iPhone</p>
          </div>

          {/* FAQ items */}
          <div className="space-y-2.5">
            <FAQItem question="¿Cómo desactivo mi cuenta de iCloud?">
              <p className="text-fg-muted text-[13px] sm:text-sm leading-relaxed mb-4">
                Si vas a vender tu iPhone, te recomendamos desactivar <strong className="text-fg">"Buscar mi iPhone"</strong> y cerrar sesión de iCloud para que el comprador pueda usarlo con su propia cuenta.
              </p>
              <div className="space-y-3.5 bg-fg/[0.03] border border-fg/[0.06] rounded-lg p-4">
                {[
                  { action: 'Abrí', target: 'Ajustes', detail: 'en tu iPhone' },
                  { action: 'Tocá', target: 'tu nombre', detail: '(arriba de todo)' },
                  { action: 'Tocá', target: '"Buscar"', detail: '' },
                  { action: 'Desactivá', target: '"Buscar mi iPhone"', detail: 'e ingresá tu contraseña' },
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#4A6BDB]/15 dark:bg-[#6B8AED]/15 text-[#4A6BDB] dark:text-[#6B8AED] text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-px">{i + 1}</span>
                    <p className="text-[13px] sm:text-sm text-fg-muted leading-snug pt-0.5">
                      {step.action} <strong className="text-fg">{step.target}</strong>{step.detail ? ` ${step.detail}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </FAQItem>

            <FAQItem question="¿Cómo me pagan?">
              <p className="text-fg-muted text-[13px] sm:text-sm leading-relaxed">
                El pago es <strong className="text-fg">inmediato</strong>, en efectivo o transferencia bancaria. Podés elegir la forma que prefieras al momento de la venta en el local.
              </p>
            </FAQItem>

            <FAQItem question="¿Dónde se concreta la operación?">
              <p className="text-fg-muted text-[13px] sm:text-sm leading-relaxed">
                Cotizá online en <strong className="text-fg">Luxstore</strong> y coordinamos la revisión del equipo y el pago. El valor final se confirma al verificar el estado del iPhone.
              </p>
            </FAQItem>

            <FAQItem question="¿Cuánto tarda cotizar mi iPhone?">
              <p className="text-fg-muted text-[13px] sm:text-sm leading-relaxed">
                <strong className="text-fg">Menos de 1 minuto.</strong> Respondé 4 preguntas sobre tu iPhone y te damos un precio estimado al instante. El valor final está sujeto a revisión del equipo en el local.
              </p>
            </FAQItem>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-line py-8 bg-bg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src={logoSrc}
                alt="Luxstore"
                className="h-10 w-auto object-contain rounded-md"
              />
            </button>

            <p className="text-fg-subtle text-sm">© {new Date().getFullYear()} Luxstore. Todos los derechos reservados.</p>

            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={startCotizar}
                className="text-fg-subtle hover:text-fg transition-colors text-sm"
              >
                Cotizar ahora
              </button>
              <button
                type="button"
                onClick={() => document.getElementById('preguntas-frecuentes')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-fg-subtle hover:text-fg transition-colors text-sm"
              >
                FAQ
              </button>
            </div>
          </div>
          <div className="border-t border-line mt-6 pt-6 text-center">
            <p className="text-xs text-fg-subtle">
              Built by{' '}
              <span className="text-fg-muted">CodeCraftStudio</span>
            </p>
          </div>
        </div>
      </footer>

    </div>
  )
}
