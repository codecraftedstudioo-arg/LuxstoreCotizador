import { useState, useEffect } from 'react'
import { fetchMarketPrices } from './market-api'
import type { Model } from '@/types/market'

interface MarketPricesState {
  models: Model[]
  loading: boolean
}

export function useMarketPrices(): MarketPricesState {
  const [state, setState] = useState<MarketPricesState>({
    models: [],
    loading: true,
  })

  useEffect(() => {
    fetchMarketPrices().then((data) => {
      setState({ models: data.models, loading: false })
    })
  }, [])

  return state
}
