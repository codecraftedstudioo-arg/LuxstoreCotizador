import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'whatsapp'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

/**
 * Reusable Button component with variants
 * Brand colors: cyan (#9de8ef), black, white
 * Includes hover scale animation
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = `
    font-medium rounded-xl
    transition-all duration-300 ease-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transform hover:scale-[1.02] active:scale-[0.98]
  `

  const variants = {
    // Brand cyan color
    primary: 'bg-cyan-400 text-gray-900 hover:bg-cyan-300 focus:ring-cyan-400 shadow-lg hover:shadow-cyan-400/25 disabled:bg-cyan-200',
    secondary: 'bg-white/20 text-white hover:bg-white/30 focus:ring-white/50 backdrop-blur-sm disabled:bg-white/10',
    outline: 'border-2 border-white/30 text-white hover:border-cyan-400 hover:text-cyan-400 focus:ring-cyan-400 backdrop-blur-sm',
    whatsapp: 'bg-green-500 text-white hover:bg-green-400 focus:ring-green-500 shadow-lg hover:shadow-green-500/25 disabled:bg-green-300',
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-4 text-lg font-semibold',
  }

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'cursor-not-allowed opacity-60 transform-none' : 'cursor-pointer'}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
