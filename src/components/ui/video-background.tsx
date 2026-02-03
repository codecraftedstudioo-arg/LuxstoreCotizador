/**
 * Image Background Component with Ken Burns Effect
 * For split view: shows prominently on left side
 * For mobile: subtle background behind wizard
 */
export function VideoBackground() {
  // iPhones elegantes - múltiples
  const images = [
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1920&q=80', // iPhones en fila elegante
    'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=1920&q=80', // iPhones sobre fondo oscuro
    'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1920&q=80', // setup moderno con iPhone
    'https://images.unsplash.com/photo-1607936854279-55e8a4c64888?w=1920&q=80', // iPhone 12 Pro Max
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

      {/* Very subtle center vignette */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-transparent via-transparent to-black/50" />

      {/* Animated light reflection */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-shimmer" />
    </div>
  )
}
