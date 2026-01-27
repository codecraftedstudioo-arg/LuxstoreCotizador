import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the wizard', () => {
    render(<App />)
    expect(screen.getByText('Cotizá tu iPhone')).toBeInTheDocument()
  })

  it('shows step 1 (model selection) by default', () => {
    render(<App />)
    expect(screen.getByText('¿Qué modelo de iPhone tenés?')).toBeInTheDocument()
  })
})
