/**
 * Video Background Component
 * Shows a looping iPhone video behind content with gradient overlay
 * Falls back to animated gradient if video fails to load
 */
export function VideoBackground() {
  // Video de iPhone de Pexels (free, no attribution required)
  // iPhone showcase video - manos usando iPhone
  const videoUrl = 'https://videos.pexels.com/video-files/6976054/6976054-uhd_2560_1440_25fps.mp4'

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      {/* Animated gradient fallback (se ve mientras carga el video) */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />

      {/* Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover opacity-60"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      {/* Subtle cyan glow at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/5 via-transparent to-transparent" />
    </div>
  )
}
