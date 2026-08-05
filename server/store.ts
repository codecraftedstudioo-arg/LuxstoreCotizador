import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import type { CotizadorStore, PanelModel } from './types'

/** Always resolve from project cwd (works under Vite middleware + Vercel). */
const DATA_PATH = join(process.cwd(), 'data', 'cotizador-prices.json')
const BLOB_PATHNAME = 'cotizador-prices.json'

function blobToken(): string {
  return process.env.BLOB_READ_WRITE_TOKEN || ''
}

/** Backfill brand / sortOrder / active for stores creados antes de Modelos. */
export function normalizeModels(models: PanelModel[]): PanelModel[] {
  return models
    .map((m, i) => ({
      id: m.id,
      name: m.name,
      brand: m.brand?.trim() || 'Apple',
      year: m.year,
      sortOrder: typeof m.sortOrder === 'number' ? m.sortOrder : i + 1,
      active: m.active !== false,
      prices: Array.isArray(m.prices) ? m.prices : [],
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
}

function normalizeStore(raw: CotizadorStore): CotizadorStore {
  return {
    ...raw,
    models: normalizeModels(raw.models as PanelModel[]),
    config: raw.config ?? {
      currency: 'USD',
      batteryThreshold: 85,
      lastUpdated: new Date().toISOString().slice(0, 10),
    },
  }
}

function isValidStore(data: unknown): data is CotizadorStore {
  if (!data || typeof data !== 'object') return false
  const d = data as CotizadorStore
  return Array.isArray(d.models) && d.models.length > 0 && Array.isArray(d.penalties) && d.penalties.length > 0
}

function readLocalFile(): CotizadorStore {
  if (!existsSync(DATA_PATH)) {
    throw new Error(`Missing store file: ${DATA_PATH}`)
  }
  const raw = JSON.parse(readFileSync(DATA_PATH, 'utf8'))
  if (!isValidStore(raw)) throw new Error('Invalid cotizador store')
  return normalizeStore(raw)
}

async function readBlob(): Promise<CotizadorStore | null> {
  const token = blobToken()
  if (!token) return null
  try {
    const res = await fetch(`https://blob.vercel-storage.com?prefix=${encodeURIComponent(BLOB_PATHNAME)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) return null
    const list = (await res.json()) as { blobs?: { pathname: string; url: string }[] }
    const hit = list.blobs?.find((b) => b.pathname === BLOB_PATHNAME || b.pathname.endsWith(`/${BLOB_PATHNAME}`))
    if (!hit?.url) return null
    const fileRes = await fetch(hit.url, { cache: 'no-store' })
    if (!fileRes.ok) return null
    const data = await fileRes.json()
    return isValidStore(data) ? normalizeStore(data) : null
  } catch {
    return null
  }
}

async function writeBlob(data: CotizadorStore): Promise<boolean> {
  const token = blobToken()
  if (!token) return false
  const res = await fetch(`https://blob.vercel-storage.com/${BLOB_PATHNAME}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'x-vercel-blob-access': 'public',
      'x-vercel-blob-allow-overwrite': 'true',
    },
    body: JSON.stringify(data),
  })
  return res.ok
}

function writeLocalFile(data: CotizadorStore): void {
  mkdirSync(dirname(DATA_PATH), { recursive: true })
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8')
}

/** Load store: Blob (if configured) → local data file. */
export async function loadStore(): Promise<CotizadorStore> {
  const fromBlob = await readBlob()
  if (fromBlob) return fromBlob
  return readLocalFile()
}

/** Persist store: Blob when token present, always write local when filesystem allows. */
export async function saveStore(data: CotizadorStore): Promise<void> {
  const normalized = normalizeStore(data)
  if (!isValidStore(normalized)) throw new Error('Invalid store payload')
  normalized.config = {
    ...normalized.config,
    lastUpdated: new Date().toISOString().slice(0, 10),
  }

  const blobOk = await writeBlob(normalized)
  try {
    writeLocalFile(normalized)
  } catch (err) {
    // On Vercel the FS is read-only; Blob must succeed.
    if (!blobOk) throw err
  }
  if (!blobOk && process.env.VERCEL === '1') {
    throw new Error('BLOB_READ_WRITE_TOKEN is required to persist changes on Vercel')
  }
}

/** Public GET payload (same contract the cotizador already consumes). */
export function toPublicPayload(store: CotizadorStore) {
  const normalized = normalizeStore(store)
  return {
    models: normalized.models,
    penalties: normalized.penalties,
    config: normalized.config,
  }
}
