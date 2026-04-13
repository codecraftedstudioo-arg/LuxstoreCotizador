import { useState, useEffect } from 'react'
import { fetchExchangeRate } from './exchange-rate'

const LS_KEY = 'ep-exchange-rate'

function getCachedRate(): number | null {
  try {
    const val = localStorage.getItem(LS_KEY)
    return val ? Number(val) : null
  } catch { return null }
}

interface ExchangeRateState {
  rate: number | null
  loading: boolean
}

/**
 * Hook to fetch and cache the USD/ARS exchange rate.
 * On refresh, shows last known real rate from localStorage (no fallback).
 */
export function useExchangeRate(): ExchangeRateState {
  const [state, setState] = useState<ExchangeRateState>({
    rate: getCachedRate(),
    loading: true,
  })

  useEffect(() => {
    fetchExchangeRate().then((rate) => {
      if (rate !== null) {
        setState({ rate, loading: false })
        try { localStorage.setItem(LS_KEY, String(rate)) } catch {}
      } else {
        setState(prev => ({ rate: prev.rate, loading: false }))
      }
    })
  }, [])

  return state
}
