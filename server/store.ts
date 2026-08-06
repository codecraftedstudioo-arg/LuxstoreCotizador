import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { put, get } from '@vercel/blob'
import type { CotizadorStore, PanelModel } from './types.js'

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

function readStoreFromPath(path: string): CotizadorStore | null {
  if (!existsSync(path)) return null
  const raw = JSON.parse(readFileSync(path, 'utf8'))
  if (!isValidStore(raw)) return null
  return normalizeStore(raw)
}

function readLocalFile(): CotizadorStore {
  // includeFiles copies data/ into /var/task on Vercel; cwd may also resolve there.
  const store =
    readStoreFromPath(DATA_PATH) ||
    readStoreFromPath(join('/var/task', 'data', 'cotizador-prices.json'))
  if (store) return store
  throw new Error(`Missing store file: ${DATA_PATH}`)
}

async function readBlob(): Promise<CotizadorStore | null> {
  const token = blobToken()
  if (!token) return null
  try {
    // useCache:false bypasses CDN and reads origin (public URLs are cached ~30d by default).
    const result = await get(BLOB_PATHNAME, { access: 'public', token, useCache: false })
    if (!result || result.statusCode !== 200 || !result.stream) return null
    const text = await new Response(result.stream).text()
    const data = JSON.parse(text)
    return isValidStore(data) ? normalizeStore(data) : null
  } catch {
    return null
  }
}

async function writeBlob(data: CotizadorStore): Promise<void> {
  const token = blobToken()
  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured')
  }
  await put(BLOB_PATHNAME, JSON.stringify(data), {
    access: 'public',
    token,
    contentType: 'application/json; charset=utf-8',
    allowOverwrite: true,
    addRandomSuffix: false,
    // Keep cache short so admin saves show up immediately in the cotizador.
    cacheControlMaxAge: 60,
  })
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

/**
 * Persist store: Blob when token present, local file when filesystem allows.
 * Returns the normalized payload that was written (do not re-read after save —
 * public Blob URLs can be CDN-cached).
 */
export async function saveStore(data: CotizadorStore): Promise<CotizadorStore> {
  const normalized = normalizeStore(data)
  if (!isValidStore(normalized)) throw new Error('Invalid store payload')
  normalized.config = {
    ...normalized.config,
    lastUpdated: new Date().toISOString().slice(0, 10),
  }

  const token = blobToken()
  let blobOk = false
  if (token) {
    await writeBlob(normalized)
    blobOk = true
  }

  try {
    writeLocalFile(normalized)
  } catch (err) {
    // On Vercel the FS is read-only; Blob must succeed.
    if (!blobOk) throw err
  }

  if (!blobOk && process.env.VERCEL === '1') {
    throw new Error('BLOB_READ_WRITE_TOKEN is required to persist changes on Vercel')
  }

  return normalized
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
