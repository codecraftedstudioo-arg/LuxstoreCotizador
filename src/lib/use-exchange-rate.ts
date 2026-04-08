import { useState, useEffect } from 'react'
import { fetchExchangeRate } from './exchange-rate'

interface ExchangeRateState {
  rate: number | null
  loading: boolean
}

/**
 * Hook to fetch and cache the USD/ARS exchange rate.
 * Returns { rate, loading }.
 * While loading, rate is null — components should hide ARS prices.
 * If fetch fails, fallback (1500) is used.
 */
export function useExchangeRate(): ExchangeRateState {
  const [state, setState] = useState<ExchangeRateState>({
    rate: null,
    loading: true,
  })

  useEffect(() => {
    fetchExchangeRate().then((rate) => {
      setState({ rate, loading: false })
    })
  }, [])

  return state
}
