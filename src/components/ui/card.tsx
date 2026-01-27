import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

/**
 * Card container for wizard steps
 * Glassmorphism effect: frosted glass look
 */
export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`
        bg-white/80 backdrop-blur-xl
        rounded-2xl shadow-2xl
        border border-white/20
        p-6
        ${className}
      `}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
}

export function CardHeader({ title, subtitle }: CardHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {subtitle && (
        <p className="mt-2 text-gray-600">{subtitle}</p>
      )}
    </div>
  )
}
