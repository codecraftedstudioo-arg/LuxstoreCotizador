import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the intro screen', () => {
    render(<App />)
    // El hero se renderiza dos veces (variante mobile + desktop), por eso getAllByText
    expect(screen.getAllByText(/Cambiá tu/).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Cotizar ahora').length).toBeGreaterThan(0)
  })

  it('shows wizard step 1 after clicking Cotizar ahora', () => {
    render(<App />)
    const startButton = screen.getAllByText('Cotizar ahora')[0]
    fireEvent.click(startButton)
    expect(screen.getByText('¿Qué querés hacer?')).toBeInTheDocument()
  })
})
