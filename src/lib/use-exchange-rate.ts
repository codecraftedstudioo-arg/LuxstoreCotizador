import { useState, useEffect } from 'react'
import { fetchExchangeRate } from './exchange-rate'

interface ExchangeRateState {
  rate: number
  loading: boolean
}

/**
 * Hook to fetch and cache the USD/ARS exchange rate.
 * Returns { rate, loading }.
 * While loading, rate defaults to 1500 so the UI never blocks.
 */
export function useExchangeRate(): ExchangeRateState {
  const [state, setState] = useState<ExchangeRateState>({
    rate: 1500,
    loading: true,
  })

  useEffect(() => {
    fetchExchangeRate().then((rate) => {
      setState({ rate, loading: false })
    })
  }, [])

  return state
}
