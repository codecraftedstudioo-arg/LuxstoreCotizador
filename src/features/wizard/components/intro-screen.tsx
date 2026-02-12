import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWizard } from '../hooks/use-wizard'




// Typewriter effect component
function Typewriter({ text, delay = 0, speed = 30 }: { text: string; delay?: number; speed?: number }) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timeout)
  }, [delay])

  useEffect(() => {
    if (!started) return
    if (displayed.length >= text.length) return
    const timeout = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1))
    }, speed)
    return () => clearTimeout(timeout)
  }, [started, displayed, text, speed])

  return (
    <span className="relative block">
      <span className="invisible">{text}</span>
      <span className="absolute inset-0">
        {displayed}
        {started && displayed.length < text.length && <span className="inline-block w-[2px] h-[1em] bg-white/60 align-middle ml-0.5 animate-pulse" />}
      </span>
    </span>
  )
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
    className={`${small ? 'w-3.5 h-3.5' : 'w-5 h-5'} ${filled ? 'text-amber-400 drop-shadow-[0_0_3px_rgba(251,191,36,0.4)]' : 'text-white/20'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
)

// Professional SVG Icons - White
const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const CurrencyIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const ShieldCheckIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
  </svg>
)

const HandshakeIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
  </svg>
)

// Custom video player — facade pattern: thumbnail + YouTube IFrame API (no YT UI visible)
function VideoPlayer() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'playing' | 'paused' | 'ended'>('idle')
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<any>(null)

  useEffect(() => {
    return () => { playerRef.current?.destroy() }
  }, [])

  const play = useCallback(() => {
    setStatus('loading')
    const create = () => {
      if (!containerRef.current) return
      const div = document.createElement('div')
      containerRef.current.prepend(div)
      playerRef.current = new (window as any).YT.Player(div, {
        videoId: 'ARv9wMPlXNs',
        playerVars: {
          autoplay: 1, controls: 0, rel: 0, showinfo: 0,
          modestbranding: 1, iv_load_policy: 3, playsinline: 1, fs: 0, disablekb: 1,
        },
        events: {
          onReady: (e: any) => { e.target.seekTo(0.5, true); setStatus('playing') },
          onStateChange: (e: any) => {
            const s = e.data
            if (s === 1) setStatus('playing')
            else if (s === 2) setStatus('paused')
            else if (s === 0) setStatus('ended')
          },
        },
      })
    }
    if ((window as any).YT?.Player) create()
    else {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
      ;(window as any).onYouTubeIframeAPIReady = create
    }
  }, [])

  const toggle = () => {
    if (!playerRef.current) return
    status === 'playing' ? playerRef.current.pauseVideo() : playerRef.current.playVideo()
  }

  const VIDEO_START = 0.5

  const restart = () => {
    if (!playerRef.current) return
    playerRef.current.seekTo(VIDEO_START, true)
    playerRef.current.playVideo()
  }

  const rewind = () => {
    if (!playerRef.current) return
    const current = playerRef.current.getCurrentTime() || VIDEO_START
    playerRef.current.seekTo(Math.max(VIDEO_START, current - 10), true)
  }

  const hasControls = status === 'playing' || status === 'paused' || status === 'ended'

  return (
    <div
      ref={containerRef}
      className="relative w-[280px] sm:w-[340px] md:w-[400px] aspect-[9/16] rounded-2xl overflow-hidden border border-white/15 shadow-2xl shadow-black/50 bg-black [&>iframe]:absolute [&>iframe]:-top-[8%] [&>iframe]:left-0 [&>iframe]:w-full [&>iframe]:h-[116%] [&>iframe]:pointer-events-none"
    >
      {/* Thumbnail + play (idle) */}
      {status === 'idle' && (
        <button onClick={play} className="absolute inset-0 z-10 flex items-center justify-center group/play cursor-pointer">
          <img
            src="https://img.youtube.com/vi/ARv9wMPlXNs/maxresdefault.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 group-hover/play:bg-black/10 transition-colors" />
          <div className="relative w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-2xl group-hover/play:scale-110 transition-transform">
            <svg className="w-7 h-7 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      )}

      {/* Loading spinner */}
      {status === 'loading' && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Tap area for pause (playing) */}
      {status === 'playing' && (
        <button onClick={toggle} className="absolute inset-0 z-10 cursor-pointer" aria-label="Pausar" />
      )}

      {/* Center icon when paused */}
      {status === 'paused' && (
        <button onClick={toggle} className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 cursor-pointer">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-2xl">
            <svg className="w-6 h-6 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      )}

      {/* Center icon when ended */}
      {status === 'ended' && (
        <button onClick={restart} className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 cursor-pointer">
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-2xl">
            <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
            </svg>
          </div>
        </button>
      )}

      {/* Top/bottom gradients to mask any YouTube UI residue */}
      {hasControls && (
        <div className="absolute top-0 left-0 right-0 z-20 h-14 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
      )}

      {/* Control bar */}
      {hasControls && (
        <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-6 py-3 bg-gradient-to-t from-black/70 to-transparent">
          {/* Restart */}
          <button onClick={restart} className="text-white/80 hover:text-white transition-colors cursor-pointer" aria-label="Reiniciar">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
            </svg>
          </button>
          {/* Rewind 10s */}
          <button onClick={rewind} className="text-white/80 hover:text-white transition-colors cursor-pointer" aria-label="Retroceder 10s">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
              <text x="7.5" y="16.5" fontSize="7.5" fontWeight="bold" fill="currentColor">10</text>
            </svg>
          </button>
          {/* Play / Pause */}
          <button onClick={toggle} className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer" aria-label={status === 'playing' ? 'Pausar' : 'Reproducir'}>
            {status === 'playing' ? (
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>
        </div>
      )}
    </div>
  )
}

export function IntroScreen() {
  const navigate = useNavigate()
  const { reset } = useWizard()
  const [menuOpen, setMenuOpen] = useState(false)


  return (
    <div className="min-h-screen bg-black">
      {/* Navbar */}
      <nav className="relative z-10 sticky top-0 bg-black/95 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-4 flex items-center justify-between">
          {/* Logo - Brand Identity */}
          <a href="https://electronicpoint.com.ar" target="_blank" rel="noopener noreferrer" className="block overflow-visible">
            <img
              src="https://dcdn-us.mitiendanube.com/stores/006/472/680/themes/common/logo-800890675-1753195492-b4e6a1266078127b839bb90c0ba04ffb1753195492-480-0.webp"
              alt="Electronic Point"
              className="h-[87px] w-[218px] lg:h-[100px] lg:w-[250px] max-w-none -ml-[55px] md:-ml-[75px]"
            />
          </a>

          {/* Nav Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            <button
               onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
               className="text-white/80 hover:text-white transition-colors text-sm">
              ¿Cómo funciona?
            </button>
            <a href="https://electronicpoint.com.ar" target="_blank" rel="noopener noreferrer"
               className="text-white/80 hover:text-white transition-colors text-sm">
              Ver iPhones
            </a>
            <a href="https://instagram.com/electronicpoint.ar" target="_blank" rel="noopener noreferrer"
               className="text-white/80 hover:text-white transition-colors text-sm">
              Instagram
            </a>
            <a href="https://www.google.com/maps/place/Electronic+Point/@-34.5831916,-58.4362603,17z/data=!4m15!1m8!3m7!1s0x95bcb58e100e0d55:0x61485b3b064191d0!2sCosta+Rica+5509,+C1414BTC+Cdad.+Aut%C3%B3noma+de+Buenos+Aires!3b1!8m2!3d-34.5831916!4d-58.43368!16s%2Fg%2F11xll028h9!3m5!1s0x95bcb58e056e77b9:0xc09faa9841bbd4c8!8m2!3d-34.5831916!4d-58.43368!16s%2Fg%2F11b6nn56rp" target="_blank" rel="noopener noreferrer"
               className="text-white/80 hover:text-white transition-colors text-sm">
              ¿Cómo llegar?
            </a>
          </div>

          {/* Hamburger button - Mobile */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white/70 hover:text-white p-2 transition-colors"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>

          {/* CTA button - Desktop */}
          <a
            href="https://electronicpoint.com.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:block px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-[#6B8AED] hover:bg-[#5A7AE0] transition-all"
          >
            Tienda online
          </a>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl">
            <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4">
              <button
                onClick={() => {
                  document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })
                  setMenuOpen(false)
                }}
                className="text-white/70 hover:text-white transition-colors text-sm text-left py-2"
              >
                ¿Cómo funciona?
              </button>
              <a href="https://electronicpoint.com.ar" target="_blank" rel="noopener noreferrer"
                 className="text-white/70 hover:text-white transition-colors text-sm py-2">
                Tienda online
              </a>
              <a href="https://instagram.com/electronicpoint.ar" target="_blank" rel="noopener noreferrer"
                 className="text-white/70 hover:text-white transition-colors text-sm py-2">
                Instagram
              </a>
              <a href="https://www.google.com/maps/place/Electronic+Point/@-34.5831916,-58.4362603,17z/data=!4m15!1m8!3m7!1s0x95bcb58e100e0d55:0x61485b3b064191d0!2sCosta+Rica+5509,+C1414BTC+Cdad.+Aut%C3%B3noma+de+Buenos+Aires!3b1!8m2!3d-34.5831916!4d-58.43368!16s%2Fg%2F11xll028h9!3m5!1s0x95bcb58e056e77b9:0xc09faa9841bbd4c8!8m2!3d-34.5831916!4d-58.43368!16s%2Fg%2F11b6nn56rp" target="_blank" rel="noopener noreferrer"
                 className="text-white/70 hover:text-white transition-colors text-sm py-2">
                ¿Cómo llegar?
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-black overflow-hidden">
        {/* Mobile background image */}
        <div className="md:hidden absolute inset-0">
          <img
            src="/hero-desktop.webp"
            alt=""
            className="w-full h-full object-cover object-[center_20%] opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:min-h-[75vh]">
            {/* Left - Text */}
            <div className="relative z-10 px-6 md:px-12 lg:px-20 pt-12 pb-12 md:py-20 md:w-1/2">
              <h1 className="text-5xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fadeSlideIn">
                Vendé tu iPhone
                <span className="block bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent mt-2">
                  al mejor precio
                </span>
              </h1>

              <p
                className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed animate-fadeSlideIn"
                style={{ animationDelay: '0.1s' }}
              >
                <Typewriter text="Cotización en 1 minuto. Pago en efectivo o transferencia. Sin vueltas." delay={800} speed={30} />
              </p>

              <div
                className="mb-10 animate-fadeSlideIn"
                style={{ animationDelay: '0.2s' }}
              >
                <button
                  onClick={() => {
                    reset()
                    navigate('/cotizar')
                  }}
                  className="btn-shimmer px-10 py-5 rounded-full text-lg font-bold text-white bg-[#4A6BDB]
                             hover:scale-105 transition-all duration-300 shadow-2xl shadow-[#4A6BDB]/30 hover:shadow-[#4A6BDB]/50"
                >
                  Cotizar ahora
                </button>
              </div>

              <div
                className="grid grid-cols-2 gap-6 animate-fadeSlideIn"
                style={{ animationDelay: '0.3s' }}
              >
                {[
                  { value: '+2000', label: 'iPhones comprados' },
                  { value: <>4.9<span className="text-amber-400 animate-star-twinkle">★</span></>, label: 'Google Reviews' },
                  { value: '24hs', label: 'Pago inmediato' },
                  { value: '+20', label: 'Años de experiencia' },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                    <div className="text-white/40 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Location - Mobile only */}
              <a
                href="https://www.google.com/maps/place/Electronic+Point/@-34.5831916,-58.4362603,17z/data=!4m15!1m8!3m7!1s0x95bcb58e100e0d55:0x61485b3b064191d0!2sCosta+Rica+5509,+C1414BTC+Cdad.+Aut%C3%B3noma+de+Buenos+Aires!3b1!8m2!3d-34.5831916!4d-58.43368!16s%2Fg%2F11xll028h9!3m5!1s0x95bcb58e056e77b9:0xc09faa9841bbd4c8!8m2!3d-34.5831916!4d-58.43368!16s%2Fg%2F11b6nn56rp"
                target="_blank"
                rel="noopener noreferrer"
                className="md:hidden mt-6 flex items-center gap-2 text-white/50 hover:text-white/70 text-sm animate-fadeSlideIn transition-colors"
                style={{ animationDelay: '0.4s' }}
              >
                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span>Estamos en Palermo, Buenos Aires</span>
              </a>
            </div>

            {/* Right - Image (desktop only) */}
            <div className="hidden md:block relative md:w-1/2 md:min-h-[75vh]">
              <img
                src="/hero-desktop.webp"
                alt="iPhones"
                className="w-full h-full object-cover object-center absolute inset-0"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="relative z-10 border-t border-white/10 bg-neutral-950"
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
                <div className="w-14 h-14 rounded-full bg-white/5 border-2 border-[#263A99]/60 flex items-center justify-center mx-auto mb-4 group-hover:border-[#263A99] group-hover:scale-110 transition-all duration-300">
                  <div className="text-[#4A6BDB]">{item.icon}</div>
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
              <div key={i} className="text-center group">
                <div className="w-14 h-14 rounded-full bg-white/5 border-2 border-[#263A99]/60 flex items-center justify-center mx-auto mb-4 group-hover:border-[#263A99] group-hover:scale-110 transition-all duration-300">
                  <span className="text-2xl font-bold text-[#4A6BDB]">{item.step}</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-white/50 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-white/40 text-sm mt-10">
            Simple, directo, sin letra chica.
          </p>
          {/* Separator */}
          <div className="flex items-center justify-center gap-3 mt-12 mb-2">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/40" />
          </div>
          {/* Video */}
          <div className="mt-8 flex flex-col items-center">
            <p className="text-sm uppercase tracking-widest text-[#4A6BDB] font-semibold mb-2">Miralo en acción</p>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-8">Así de fácil es vender tu iPhone</h3>
            <div className="relative group">
              <div className="absolute -inset-3 bg-[#4A6BDB]/15 rounded-3xl blur-2xl group-hover:bg-[#4A6BDB]/25 transition-all duration-500" />
              <VideoPlayer />
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section
        className="relative z-10 border-t border-white/10 bg-black py-12 overflow-hidden"
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
                className="h-20 md:h-16 w-auto"
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
