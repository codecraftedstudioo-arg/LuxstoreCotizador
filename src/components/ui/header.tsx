/**
 * Header with logo and link to main site
 */
export function Header() {
  const mainSiteUrl = 'https://electronicpoint.com.ar/'
  const logoUrl = 'https://dcdn-us.mitiendanube.com/stores/006/472/680/themes/common/logo-800890675-1753195492-b4e6a1266078127b839bb90c0ba04ffb1753195492-480-0.webp'

  return (
    <header className="w-full py-4 px-4">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Logo con link al sitio principal */}
        <a
          href={mainSiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 group"
        >
          <img
            src={logoUrl}
            alt="Electronic Point"
            className="h-10 w-auto object-contain filter drop-shadow-lg transition-transform group-hover:scale-105"
          />
        </a>

        {/* Link a la tienda */}
        <a
          href={mainSiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            text-sm text-white/80 hover:text-cyan-300
            transition-colors duration-200
            flex items-center gap-1
          "
        >
          Ver tienda
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </header>
  )
}
