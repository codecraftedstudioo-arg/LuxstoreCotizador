/**
 * Video Background Component
 * Shows a looping iPhone video behind content with gradient overlay
 *
 * IMPORTANTE: Colocá tu video en /public/background.mp4
 * Descargá uno gratis de:
 * - https://coverr.co/stock-video-footage/iphone-15
 * - https://www.pexels.com/search/videos/iphone/
 */
export function VideoBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      {/* Animated gradient fallback (se ve si no hay video o mientras carga) */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        {/* Subtle animated glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-900/20 via-transparent to-purple-900/20 animate-pulse" />
      </div>

      {/* Video local - poné background.mp4 en /public/ */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover opacity-50"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

      {/* Subtle cyan glow at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent" />
    </div>
  )
}
