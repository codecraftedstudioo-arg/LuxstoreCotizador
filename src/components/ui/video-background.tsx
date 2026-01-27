/**
 * Video Background Component
 * Shows a looping video behind content with gradient overlay
 * Falls back to gradient if video fails to load
 */
export function VideoBackground() {
  // Video de tecnología/smartphones de Pexels (free, no attribution)
  // Podés reemplazar esta URL por otro video
  const videoUrl = 'https://videos.pexels.com/video-files/5081912/5081912-uhd_2560_1440_25fps.mp4'

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover"
        poster="/video-poster.jpg"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      {/* Animated gradient accent (cyan brand color) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-cyan-400/10 animate-pulse" />
    </div>
  )
}
