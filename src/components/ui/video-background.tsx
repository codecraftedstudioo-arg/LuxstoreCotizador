/**
 * Image Background Component with Ken Burns Effect
 * Multiple images that crossfade with slow zoom animation
 * More performant than video, always works
 */
export function VideoBackground() {
  // Imágenes de iPhones de Unsplash (free, no attribution required)
  // Variedad: colores, ángulos, estilos
  const images = [
    'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=1920&q=80', // iPhone colorido
    'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=1920&q=80', // iPhone Pro silver
    'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=1920&q=80', // iPhones múltiples
    'https://images.unsplash.com/photo-1580910051074-3eb694886f3b?w=1920&q=80', // iPhone gold elegante
  ]

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      {/* Base dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-950" />

      {/* Images with Ken Burns effect (crossfade + zoom) */}
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
              animationDuration: '24s',
            }}
          />
        ))}
      </div>

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      {/* Animated light reflection */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-500/5 to-transparent animate-shimmer" />

      {/* Bottom cyan glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 via-transparent to-transparent" />
    </div>
  )
}
