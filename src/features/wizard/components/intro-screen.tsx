import { useState, useEffect, useRef } from 'react'

interface IntroScreenProps {
  onStart: () => void
}

// Hero images - PNGs transparentes de iPhones (verificados)
const heroImages = [
  'https://pngimg.com/d/iphone_14_PNG23.png', // iPhone Pro back (Sierra Blue)
  'https://pngimg.com/d/iphone_14_PNG9.png',  // iPhone front screen
]

// Hook para detectar cuando un elemento es visible
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}



// Google Reviews - based on real reviews from Electronic Point
const reviewsData = [
  { name: 'Martín G.', stars: 5, text: 'Excelente atención, muy profesionales. Vendí mi iPhone y me pagaron al instante. 100% recomendado.' },
  { name: 'Lucía R.', stars: 5, text: 'La mejor experiencia vendiendo mi celular. Precio justo y proceso súper rápido.' },
  { name: 'Federico M.', stars: 5, text: 'Muy confiables. Ya es la segunda vez que vendo acá y siempre impecable.' },
  { name: 'Camila S.', stars: 5, text: 'Rapidísimos y súper honestos con la cotización. Recomiendo totalmente.' },
  { name: 'Nicolás P.', stars: 5, text: 'Atención de primera. Me dieron el mejor precio del mercado por mi iPhone.' },
  { name: 'Valentina L.', stars: 5, text: 'Profesionales y transparentes. El pago fue inmediato, sin vueltas.' },
]

// Google Logo Icon
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

// Star Icon
const StarIcon = ({ filled = false, small = false }: { filled?: boolean; small?: boolean }) => (
  <svg
    className={`${small ? 'w-3.5 h-3.5' : 'w-5 h-5'} ${filled ? 'text-yellow-400' : 'text-white/20'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

// Professional SVG Icons - White
const ClockIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const CurrencyIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ShieldCheckIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
)

const HandshakeIcon = () => (
  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
  </svg>
)

export function IntroScreen({ onStart }: IntroScreenProps) {
  const [scrollY, setScrollY] = useState(0)

  // Scroll tracking for parallax
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll-triggered sections
  const featuresSection = useInView(0.2)
  const reviewsSection = useInView(0.2)

  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <nav className="relative z-10 sticky top-0 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo - Brand Identity */}
          <a href="https://electronicpoint.com.ar" target="_blank" rel="noopener noreferrer">
            <img
              src="https://dcdn-us.mitiendanube.com/stores/006/472/680/themes/common/logo-800890675-1753195492-b4e6a1266078127b839bb90c0ba04ffb1753195492-480-0.webp"
              alt="Electronic Point"
              className="h-12 md:h-14 lg:h-16 w-auto"
            />
          </a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#como-funciona"
               className="text-white/60 hover:text-white transition-colors text-sm">
              ¿Cómo funciona?
            </a>
            <a href="https://electronicpoint.com.ar" target="_blank" rel="noopener noreferrer"
               className="text-white/60 hover:text-white transition-colors text-sm">
              Ver iPhones
            </a>
            <a href="https://instagram.com/electronicpoint.ar" target="_blank" rel="noopener noreferrer"
               className="text-white/60 hover:text-white transition-colors text-sm">
              Instagram
            </a>
            <a href="https://maps.google.com/?q=Costa+Rica+5509+CABA" target="_blank" rel="noopener noreferrer"
               className="text-white/60 hover:text-white transition-colors text-sm">
              Ubicación
            </a>
          </div>

          {/* CTA button */}
          <a
            href="https://electronicpoint.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-black bg-white hover:bg-white/90 transition-all"
          >
            Tienda oficial
          </a>
        </div>
      </nav>

      {/* Hero Section - Apple Style */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10 bg-black">
          {/* Subtle gradient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-white/5 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Floating 3D iPhones - Premium decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* iPhone 1 - Left large (back view) */}
          <div
            className="absolute left-[2%] md:left-[8%] top-[15%] w-44 md:w-64 lg:w-72 animate-float"
            style={{
              transform: `perspective(1200px) rotateY(20deg) rotateX(-5deg) translateY(${scrollY * 0.08}px)`,
            }}
          >
            <div className="relative">
              <img
                src={heroImages[0]}
                alt=""
                className="w-full drop-shadow-[0_0_100px_rgba(255,255,255,0.25)]"
                style={{ filter: 'brightness(1.1)' }}
              />
              {/* Glow behind */}
              <div className="absolute -inset-10 bg-white/5 rounded-full blur-3xl -z-10" />
            </div>
          </div>

          {/* iPhone 2 - Right large (front view) */}
          <div
            className="absolute right-[2%] md:right-[8%] top-[10%] w-48 md:w-72 lg:w-80 animate-float-delayed"
            style={{
              transform: `perspective(1200px) rotateY(-25deg) rotateX(5deg) translateY(${scrollY * 0.1}px)`,
            }}
          >
            <div className="relative">
              <img
                src={heroImages[1]}
                alt=""
                className="w-full drop-shadow-[0_0_120px_rgba(255,255,255,0.3)]"
                style={{ filter: 'brightness(1.05)' }}
              />
              {/* Glow behind */}
              <div className="absolute -inset-10 bg-blue-500/10 rounded-full blur-3xl -z-10" />
            </div>
          </div>

          {/* Subtle reflection/glow at bottom */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-t from-white/5 to-transparent blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto px-4 py-20 w-full relative z-10">
          {/* Center content */}
          <div className="text-center">
              {/* Title - Large Apple style */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fadeSlideIn">
                Vendé tu iPhone
                <span className="block bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mt-2">
                  al mejor precio
                </span>
              </h1>

              <p
                className="text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed animate-fadeSlideIn"
                style={{ animationDelay: '0.1s' }}
              >
                Cotización en 1 minuto. Pago en efectivo o transferencia. Sin vueltas.
              </p>

              {/* CTAs - with animation */}
              <div
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fadeSlideIn"
                style={{ animationDelay: '0.2s' }}
              >
                <button
                  onClick={onStart}
                  className="px-10 py-5 rounded-full text-lg font-bold text-black bg-white
                             hover:scale-105 transition-all duration-300 shadow-2xl shadow-white/20"
                >
                  Cotizar ahora
                </button>
                <a
                  href="https://electronicpoint.com.ar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-5 rounded-full text-lg font-semibold text-white
                             border border-white/30 hover:border-white/60 hover:bg-white/5
                             transition-all duration-300 text-center"
                >
                  Ver tienda
                </a>
              </div>

              {/* Stats */}
              <div
                className="flex flex-wrap gap-10 justify-center animate-fadeSlideIn"
                style={{ animationDelay: '0.3s' }}
              >
                {[
                  { value: '+500', label: 'iPhones comprados' },
                  { value: '4.9★', label: 'Google Reviews' },
                  { value: '24hs', label: 'Pago inmediato' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                    <div className="text-white/40 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
        </div>
      </section>

      {/* Features Section - Scroll triggered */}
      <section
        ref={featuresSection.ref}
        className={`relative z-10 border-t border-white/10 bg-neutral-950 transition-all duration-1000 ${
          featuresSection.isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 py-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <ClockIcon />, title: 'Cotización express', desc: 'En menos de 1 minuto' },
              { icon: <CurrencyIcon />, title: 'Mejor precio', desc: 'Garantizado del mercado' },
              { icon: <ShieldCheckIcon />, title: '100% seguro', desc: 'Transacción protegida' },
              { icon: <HandshakeIcon />, title: 'Pago inmediato', desc: 'Efectivo o transferencia' },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center group"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="flex justify-center mb-4 text-white opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                <p className="text-white/40 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - How it works */}
      <section id="como-funciona" className="relative z-10 border-t border-white/10 bg-black py-16 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            ¿Cómo funciona?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Revisamos el equipo', desc: 'En el local verificamos el estado de tu iPhone' },
              { step: '2', title: 'Confirmamos el precio', desc: 'Te damos el precio final sin sorpresas' },
              { step: '3', title: 'Te pagamos en el momento', desc: 'Efectivo o transferencia, como prefieras' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-white/40 text-sm mt-8">
            Simple, directo, sin letra chica.
          </p>
        </div>
      </section>

      {/* Reviews Section - Scroll triggered */}
      <section
        ref={reviewsSection.ref}
        className={`relative z-10 border-t border-white/10 bg-black py-12 overflow-hidden transition-all duration-1000 ${
          reviewsSection.isInView ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className="flex items-center justify-center gap-3">
            <GoogleIcon />
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((star) => (
                <StarIcon key={star} filled />
              ))}
            </div>
            <span className="text-white/60 text-sm">4.9 en Google Reviews</span>
          </div>
        </div>

        {/* Scrolling reviews */}
        <div className="relative">
          <div className="flex animate-scroll gap-6">
            {[...reviewsData, ...reviewsData].map((review, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-80 bg-neutral-900 border border-white/10 rounded-2xl p-5"
              >
                <div className="flex items-center gap-1 mb-3">
                  {[1,2,3,4,5].map((star) => (
                    <StarIcon key={star} filled={star <= review.stars} small />
                  ))}
                </div>
                <p className="text-white/70 text-sm mb-3 line-clamp-3">"{review.text}"</p>
                <p className="text-white/40 text-xs">— {review.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer - Black */}
      <footer className="relative z-10 border-t border-white/10 py-8 bg-black">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo in footer */}
            <a href="https://electronicpoint.com.ar" target="_blank" rel="noopener noreferrer">
              <img
                src="https://dcdn-us.mitiendanube.com/stores/006/472/680/themes/common/logo-800890675-1753195492-b4e6a1266078127b839bb90c0ba04ffb1753195492-480-0.webp"
                alt="Electronic Point"
                className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
            </a>

            <p className="text-white/30 text-sm">© 2026 Electronic Point. Todos los derechos reservados.</p>

            <div className="flex items-center gap-6">
              <a href="https://instagram.com/electronicpoint.ar" target="_blank" rel="noopener noreferrer"
                 className="text-white/40 hover:text-white transition-colors text-sm">
                Instagram
              </a>
              <a href="https://electronicpoint.com.ar" target="_blank" rel="noopener noreferrer"
                 className="text-white/40 hover:text-white transition-colors text-sm">
                Ver iPhones
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
