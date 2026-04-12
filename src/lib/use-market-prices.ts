import { useState, useEffect } from 'react'
import { fetchMarketPrices } from './market-api'
import fallbackData from '@/config/market-pricing.json'
import type { Model, MarketPricing } from '@/types/market'

interface MarketPricesState {
  models: Model[]
  loading: boolean
}

export function useMarketPrices(): MarketPricesState {
  const [state, setState] = useState<MarketPricesState>({
    models: (fallbackData as MarketPricing).models,
    loading: true,
  })

  useEffect(() => {
    fetchMarketPrices().then((data) => {
      setState({ models: data.models, loading: false })
    })
  }, [])

  return state
}
