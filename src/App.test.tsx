import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the intro screen', () => {
    render(<App />)
    expect(screen.getByText(/Cambia tu/)).toBeInTheDocument()
    expect(screen.getByText('Cotizar mi iPhone')).toBeInTheDocument()
  })

  it('shows wizard step 1 after clicking Cotizar ahora', () => {
    render(<App />)
    const startButton = screen.getByText('Cotizar mi iPhone')
    fireEvent.click(startButton)
    expect(screen.getByText('¿Qué querés hacer?')).toBeInTheDocument()
  })
})
