import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchMarketPrices } from './market-api'
import type { Model } from '@/types/market'

const CACHE_KEY = 'market-prices-cache-v1'
const RETRY_DELAYS_MS = [1500, 3000, 6000]

interface CachedPayload {
  models: Model[]
  timestamp: number
}

interface MarketPricesState {
  models: Model[]
  loading: boolean
}

function readCache(): Model[] | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CachedPayload
    if (!Array.isArray(parsed.models) || parsed.models.length === 0) return null
    return parsed.models
  } catch {
    return null
  }
}

function writeCache(models: Model[]) {
  if (typeof window === 'undefined') return
  try {
    const payload: CachedPayload = { models, timestamp: Date.now() }
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload))
  } catch { /* ignore */ }
}

export function useMarketPrices(): MarketPricesState & { refresh: () => void } {
  const [state, setState] = useState<MarketPricesState>(() => {
    const cached = readCache()
    return { models: cached ?? [], loading: cached === null }
  })
  const retryTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mountedRef = useRef(true)

  const load = useCallback((attempt = 0) => {
    fetchMarketPrices()
      .then((data) => {
        if (!mountedRef.current) return
        if (data.models?.length > 0) {
          writeCache(data.models)
          setState({ models: data.models, loading: false })
        }
      })
      .catch(() => {
        if (!mountedRef.current) return
        const delay = RETRY_DELAYS_MS[attempt]
        if (delay !== undefined) {
          retryTimeoutRef.current = setTimeout(() => load(attempt + 1), delay)
        }
      })
  }, [])

  useEffect(() => {
    mountedRef.current = true
    load()
    return () => {
      mountedRef.current = false
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current)
    }
  }, [load])

  const refresh = useCallback(() => {
    if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current)
    load()
  }, [load])

  return { ...state, refresh }
}
