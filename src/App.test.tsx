import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the wizard', () => {
    render(<App />)
    expect(screen.getByText('¿Cuánto vale tu iPhone?')).toBeInTheDocument()
  })

  it('shows step 1 (basics) by default', () => {
    render(<App />)
    expect(screen.getByText('¿Qué iPhone tenés?')).toBeInTheDocument()
  })
})
