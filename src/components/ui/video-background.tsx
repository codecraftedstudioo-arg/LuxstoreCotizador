/**
 * Image Background Component with Ken Burns Effect
 * For split view: shows prominently on left side
 * For mobile: subtle background behind wizard
 */
export function VideoBackground() {
  // Imágenes de iPhones de Unsplash (free, no attribution required)
  const images = [
    'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=1920&q=80', // iPhone colorido
    'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=1920&q=80', // iPhone Pro silver
    'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=1920&q=80', // iPhones múltiples
    'https://images.unsplash.com/photo-1580910051074-3eb694886f3b?w=1920&q=80', // iPhone gold elegante
  ]

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black" />

      {/* Images with Ken Burns effect */}
      <div className="absolute inset-0">
        {images.map((src, index) => (
          <div
            key={index}
            className="absolute inset-0 opacity-0 animate-kenburns"
            style={{
              backgroundImage: `url(${src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              animationDelay: `${index * 8}s`,
              animationDuration: '32s',
            }}
          />
        ))}
      </div>

      {/* Subtle overlay - less dark to show images better */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/50" />

      {/* Animated light reflection */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-500/10 to-transparent animate-shimmer" />

      {/* Brand color accent at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/20 via-transparent to-transparent" />

      {/* Edge fade towards wizard side */}
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-gray-950 to-transparent" />
    </div>
  )
}
