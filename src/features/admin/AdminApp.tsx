import { useCallback, useEffect, useMemo, useState } from 'react'
import type { CotizadorStore, PanelModel, PanelPenalty } from '@/types/admin-store'

type Tab = 'models' | 'prices' | 'penalties' | 'config'

type PriceRow = {
  modelId: number
  brand: string
  model: string
  family: string
  storage: string
  priceUsd: number
}

type ModelFormState = {
  id?: number
  name: string
  brand: string
  year: string
  sortOrder: number
  active: boolean
}

const DEFAULT_STORAGES = ['128', '256', '512'] as const

function emptyModelForm(sortOrder: number): ModelFormState {
  return {
    name: '',
    brand: 'Apple',
    year: '',
    sortOrder,
    active: true,
  }
}

function familyOf(model: string): string {
  const m = model.replace(/^iPhone\s+/i, '')
  const gen = m.match(/^(\d{2}e?|\d{2})/)?.[1]
  if (/Pro Max/i.test(m)) return `${gen ?? ''} Pro Max`.trim()
  if (/Pro/i.test(m)) return `${gen ?? ''} Pro`.trim()
  if (/Plus/i.test(m)) return `${gen ?? ''} Plus`.trim()
  if (/mini/i.test(m)) return `${gen ?? ''} mini`.trim()
  if (/Air/i.test(m)) return `${gen ?? ''} Air`.trim()
  return gen ?? m
}

function sortedModels(models: PanelModel[]): PanelModel[] {
  return [...models].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id)
}

function pricedCount(m: PanelModel): number {
  return m.prices.filter((p) => p.priceUsd > 0).length
}

function flattenRows(models: PanelModel[]): PriceRow[] {
  return sortedModels(models).flatMap((m) =>
    m.prices.map((p) => ({
      modelId: m.id,
      brand: m.brand || 'Apple',
      model: m.name,
      family: familyOf(m.name),
      storage: p.storage,
      priceUsd: p.priceUsd,
    })),
  )
}

function formatPenaltyDisplay(p: PanelPenalty): string {
  if (p.type === 'fixed_usd') return `USD ${p.value}`
  return `${Math.round(p.value * 1000) / 10}%`
}

export function AdminApp() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [tab, setTab] = useState<Tab>('models')
  const [store, setStore] = useState<CotizadorStore | null>(null)
  const [draft, setDraft] = useState<CotizadorStore | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [query, setQuery] = useState('')
  const [brand, setBrand] = useState('all')
  const [family, setFamily] = useState('all')
  const [modelForm, setModelForm] = useState<ModelFormState | null>(null)
  const [modelQuery, setModelQuery] = useState('')

  const dirty = useMemo(() => JSON.stringify(store) !== JSON.stringify(draft), [store, draft])

  const checkSession = useCallback(async () => {
    const res = await fetch('/api/admin/session', { credentials: 'include' })
    const data = await res.json()
    setAuthed(Boolean(data.authenticated))
  }, [])

  const loadStore = useCallback(async () => {
    const res = await fetch('/api/admin/cotizador-prices', { credentials: 'include' })
    if (res.status === 401) {
      setAuthed(false)
      return
    }
    if (!res.ok) throw new Error('No se pudo cargar el panel')
    const data = (await res.json()) as CotizadorStore
    setStore(structuredClone(data))
    setDraft(structuredClone(data))
  }, [])

  useEffect(() => {
    checkSession().catch(() => setAuthed(false))
  }, [checkSession])

  useEffect(() => {
    if (authed) loadStore().catch((e) => setMessage(e.message))
  }, [authed, loadStore])

  async function login(e: React.FormEvent) {
    e.preventDefault()
    setLoginError('')
    setBusy(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        setLoginError('Contraseña incorrecta')
        return
      }
      setPassword('')
      setAuthed(true)
    } finally {
      setBusy(false)
    }
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
    setAuthed(false)
    setStore(null)
    setDraft(null)
  }

  async function save() {
    if (!draft) return
    setBusy(true)
    setMessage('')
    try {
      const res = await fetch('/api/admin/cotizador-prices', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al guardar')
      setStore(structuredClone(data))
      setDraft(structuredClone(data))
      setMessage('Cambios guardados')
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Error al guardar')
    } finally {
      setBusy(false)
    }
  }

  function cancel() {
    if (!store) return
    setDraft(structuredClone(store))
    setMessage('Cambios descartados')
  }

  const rows = useMemo(() => (draft ? flattenRows(draft.models) : []), [draft])
  const families = useMemo(() => [...new Set(rows.map((r) => r.family))].sort(), [rows])
  const brands = useMemo(() => [...new Set(rows.map((r) => r.brand))].sort(), [rows])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((r) => {
      if (brand !== 'all' && r.brand !== brand) return false
      if (family !== 'all' && r.family !== family) return false
      if (!q) return true
      return `${r.brand} ${r.model} ${r.storage} ${r.family}`.toLowerCase().includes(q)
    })
  }, [rows, query, brand, family])

  function updatePrice(modelId: number, storage: string, priceUsd: number) {
    if (!draft) return
    setDraft({
      ...draft,
      models: draft.models.map((m) =>
        m.id !== modelId
          ? m
          : {
              ...m,
              prices: m.prices.map((p) => (p.storage === storage ? { ...p, priceUsd } : p)),
            },
      ),
    })
  }

  function updatePenalty(key: string, value: number) {
    if (!draft) return
    setDraft({
      ...draft,
      penalties: draft.penalties.map((p) => (p.key === key ? { ...p, value } : p)),
    })
  }

  const modelsSorted = useMemo(() => (draft ? sortedModels(draft.models) : []), [draft])
  const modelStats = useMemo(() => {
    const total = modelsSorted.length
    const active = modelsSorted.filter((m) => m.active).length
    const withoutPrices = modelsSorted.filter((m) => pricedCount(m) === 0).length
    return { total, active, withoutPrices }
  }, [modelsSorted])

  const filteredModels = useMemo(() => {
    const q = modelQuery.trim().toLowerCase()
    if (!q) return modelsSorted
    return modelsSorted.filter((m) => `${m.brand} ${m.name}`.toLowerCase().includes(q))
  }, [modelsSorted, modelQuery])

  function toggleModelActive(id: number) {
    if (!draft) return
    setDraft({
      ...draft,
      models: draft.models.map((m) => (m.id === id ? { ...m, active: !m.active } : m)),
    })
  }

  function openCreateModel() {
    if (!draft) return
    const nextOrder = Math.max(0, ...draft.models.map((m) => m.sortOrder)) + 1
    setModelForm(emptyModelForm(nextOrder))
  }

  function openEditModel(m: PanelModel) {
    setModelForm({
      id: m.id,
      name: m.name,
      brand: m.brand || 'Apple',
      year: m.year != null ? String(m.year) : '',
      sortOrder: m.sortOrder,
      active: m.active,
    })
  }

  function saveModelForm() {
    if (!draft || !modelForm) return
    const name = modelForm.name.trim()
    const brandName = modelForm.brand.trim() || 'Apple'
    if (!name) {
      setMessage('El nombre del modelo es obligatorio')
      return
    }
    const yearNum = modelForm.year.trim() ? Number(modelForm.year) : undefined
    if (modelForm.year.trim() && (!Number.isFinite(yearNum) || yearNum! < 2000)) {
      setMessage('Año inválido')
      return
    }

    if (modelForm.id != null) {
      setDraft({
        ...draft,
        models: draft.models.map((m) =>
          m.id !== modelForm.id
            ? m
            : {
                ...m,
                name,
                brand: brandName,
                year: yearNum,
                sortOrder: modelForm.sortOrder,
                active: modelForm.active,
              },
        ),
      })
    } else {
      const nextId = Math.max(0, ...draft.models.map((m) => m.id)) + 1
      const created: PanelModel = {
        id: nextId,
        name,
        brand: brandName,
        year: yearNum,
        sortOrder: modelForm.sortOrder,
        active: modelForm.active,
        prices: DEFAULT_STORAGES.map((storage) => ({ storage, priceUsd: 0 })),
      }
      setDraft({ ...draft, models: [...draft.models, created] })
    }
    setModelForm(null)
    setMessage('')
  }

  function deleteModel(id: number) {
    if (!draft) return
    if (draft.models.length <= 1) {
      setMessage('Debe quedar al menos un modelo')
      return
    }
    const target = draft.models.find((m) => m.id === id)
    if (!target) return
    if (!window.confirm(`¿Eliminar «${target.name}»? Se borrarán también sus precios.`)) return
    setDraft({
      ...draft,
      models: draft.models.filter((m) => m.id !== id),
    })
  }

  if (authed === null) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center text-fg-muted text-sm">
        Cargando…
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <form
          onSubmit={login}
          className="w-full max-w-sm rounded-2xl border border-line bg-surface p-6 shadow-sm space-y-4"
        >
          <div className="space-y-1">
            <img src="/luxstore-logo-light.png" alt="Luxstore" className="h-8 w-auto rounded-md mb-3" />
            <h1 className="text-fg text-xl font-semibold">Panel de administración</h1>
            <p className="text-fg-subtle text-sm">Ingresá para gestionar precios del cotizador.</p>
          </div>
          <label className="block space-y-1.5">
            <span className="text-sm text-fg-muted">Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-line bg-bg px-3 py-2.5 text-fg outline-none focus:border-accent"
              autoComplete="current-password"
              required
            />
          </label>
          {loginError && <p className="text-sm text-red-500">{loginError}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-accent text-accent-contrast py-2.5 text-sm font-semibold hover:bg-accent-hover disabled:opacity-60"
          >
            {busy ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-20 border-b border-line bg-bg/95 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <img src="/luxstore-logo-light.png" alt="Luxstore" className="h-8 w-auto rounded-md" />
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">Admin · Cotizador</p>
              <p className="text-[11px] text-fg-subtle">Modelos, precios, penalizaciones y configuración</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {dirty && (
              <>
                <button
                  type="button"
                  onClick={cancel}
                  disabled={busy}
                  className="rounded-lg border border-line px-3 py-1.5 text-sm text-fg-muted hover:text-fg"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={save}
                  disabled={busy}
                  className="rounded-lg bg-accent text-accent-contrast px-3 py-1.5 text-sm font-semibold hover:bg-accent-hover disabled:opacity-60"
                >
                  Guardar
                </button>
              </>
            )}
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-line px-3 py-1.5 text-sm text-fg-muted hover:text-fg"
            >
              Salir
            </button>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto">
          {(
            [
              ['models', 'Modelos'],
              ['prices', 'Precios'],
              ['penalties', 'Penalizaciones'],
              ['config', 'Configuración'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`rounded-full px-3 py-1.5 text-sm whitespace-nowrap border transition-colors ${
                tab === id
                  ? 'border-accent bg-accent/10 text-fg font-semibold'
                  : 'border-line text-fg-muted hover:text-fg'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        {message && (
          <p className="text-sm text-fg-muted rounded-xl border border-line bg-bg-subtle px-3 py-2">{message}</p>
        )}

        {!draft ? (
          <p className="text-fg-subtle text-sm">Cargando datos…</p>
        ) : tab === 'models' ? (
          <section className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Modelos del cotizador</h2>
                <p className="text-sm text-fg-muted">
                  Activá, ordená y administrá los equipos visibles en el cotizador.
                </p>
              </div>
              <button
                type="button"
                onClick={openCreateModel}
                className="rounded-xl bg-emerald-600 text-white px-3.5 py-2 text-sm font-semibold hover:bg-emerald-700"
              >
                + Agregar modelo
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-line bg-surface px-3 py-3">
                <p className="text-[11px] text-fg-subtle uppercase tracking-wide">Total</p>
                <p className="text-xl font-semibold tabular-nums">{modelStats.total}</p>
              </div>
              <div className="rounded-2xl border border-line bg-surface px-3 py-3">
                <p className="text-[11px] text-fg-subtle uppercase tracking-wide">Activos</p>
                <p className="text-xl font-semibold tabular-nums text-emerald-600">{modelStats.active}</p>
              </div>
              <div className="rounded-2xl border border-line bg-surface px-3 py-3">
                <p className="text-[11px] text-fg-subtle uppercase tracking-wide">Sin precios</p>
                <p className="text-xl font-semibold tabular-nums text-amber-600">{modelStats.withoutPrices}</p>
              </div>
            </div>

            <input
              value={modelQuery}
              onChange={(e) => setModelQuery(e.target.value)}
              placeholder="Buscar modelo…"
              className="w-full max-w-md rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
            />

            {modelForm && (
              <div className="rounded-2xl border border-line bg-surface p-4 space-y-3">
                <h3 className="font-semibold text-sm">
                  {modelForm.id != null ? 'Editar modelo' : 'Nuevo modelo'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="block space-y-1">
                    <span className="text-xs text-fg-muted">Nombre</span>
                    <input
                      value={modelForm.name}
                      onChange={(e) => setModelForm({ ...modelForm, name: e.target.value })}
                      placeholder="iPhone 16 Pro"
                      className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-xs text-fg-muted">Marca</span>
                    <input
                      value={modelForm.brand}
                      onChange={(e) => setModelForm({ ...modelForm, brand: e.target.value })}
                      className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-xs text-fg-muted">Año (opcional)</span>
                    <input
                      type="number"
                      value={modelForm.year}
                      onChange={(e) => setModelForm({ ...modelForm, year: e.target.value })}
                      placeholder="2024"
                      className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-xs text-fg-muted">Orden de visualización</span>
                    <input
                      type="number"
                      min={1}
                      value={modelForm.sortOrder}
                      onChange={(e) =>
                        setModelForm({ ...modelForm, sortOrder: Number(e.target.value) || 1 })
                      }
                      className="w-full rounded-xl border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
                    />
                  </label>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={modelForm.active}
                    onChange={(e) => setModelForm({ ...modelForm, active: e.target.checked })}
                  />
                  Activo (visible en el cotizador)
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={saveModelForm}
                    className="rounded-lg bg-accent text-accent-contrast px-3 py-1.5 text-sm font-semibold hover:bg-accent-hover"
                  >
                    Guardar en borrador
                  </button>
                  <button
                    type="button"
                    onClick={() => setModelForm(null)}
                    className="rounded-lg border border-line px-3 py-1.5 text-sm text-fg-muted hover:text-fg"
                  >
                    Cerrar
                  </button>
                </div>
                {modelForm.id == null && (
                  <p className="text-xs text-fg-subtle">
                    Se crean capacidades 128 / 256 / 512 GB a USD 0; asigná precios en la pestaña Precios.
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              {filteredModels.map((m) => {
                const n = pricedCount(m)
                return (
                  <div
                    key={m.id}
                    className="rounded-2xl border border-line bg-surface px-4 py-3 flex flex-wrap items-center gap-3 justify-between"
                  >
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold truncate">{m.name}</p>
                        {m.active ? (
                          <span className="text-[11px] font-semibold uppercase tracking-wide rounded-full bg-emerald-500/15 text-emerald-700 px-2 py-0.5">
                            Activo
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold uppercase tracking-wide rounded-full bg-fg-subtle/15 text-fg-muted px-2 py-0.5">
                            Inactivo
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-fg-subtle">
                        {m.brand}
                        {m.year != null ? ` · ${m.year}` : ''} · orden {m.sortOrder} · {n} precio
                        {n === 1 ? '' : 's'} activo{n === 1 ? '' : 's'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModel(m)}
                        className="rounded-lg border border-line px-2.5 py-1.5 text-xs text-fg-muted hover:text-fg"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteModel(m.id)}
                        className="rounded-lg border border-line px-2.5 py-1.5 text-xs text-red-500 hover:bg-red-500/5"
                      >
                        Eliminar
                      </button>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={m.active}
                        onClick={() => toggleModelActive(m.id)}
                        className={`relative h-7 w-12 rounded-full transition-colors ${
                          m.active ? 'bg-emerald-500' : 'bg-line'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                            m.active ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                )
              })}
              {filteredModels.length === 0 && (
                <p className="text-center text-sm text-fg-subtle py-8">Sin modelos</p>
              )}
            </div>
            <p className="text-xs text-fg-subtle">
              Desactivar oculta el modelo en el cotizador sin borrarlo. Guardá arriba para persistir.
            </p>
          </section>
        ) : tab === 'prices' ? (
          <section className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar modelo…"
                className="rounded-xl border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
              />
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="rounded-xl border border-line bg-surface px-3 py-2 text-sm"
              >
                <option value="all">Todas las marcas</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
              <select
                value={family}
                onChange={(e) => setFamily(e.target.value)}
                className="rounded-xl border border-line bg-surface px-3 py-2 text-sm"
              >
                <option value="all">Todas las familias</option>
                {families.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
              <table className="min-w-full text-sm">
                <thead className="bg-bg-subtle text-left text-fg-muted">
                  <tr>
                    <th className="px-3 py-2.5 font-medium">Marca</th>
                    <th className="px-3 py-2.5 font-medium">Modelo</th>
                    <th className="px-3 py-2.5 font-medium">Capacidad</th>
                    <th className="px-3 py-2.5 font-medium">Precio base (USD)</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr key={`${r.modelId}-${r.storage}`} className="border-t border-line">
                      <td className="px-3 py-2 text-fg-muted">{r.brand}</td>
                      <td className="px-3 py-2 font-medium">{r.model}</td>
                      <td className="px-3 py-2">{r.storage} GB</td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          min={0}
                          step={1}
                          value={r.priceUsd}
                          onChange={(e) => updatePrice(r.modelId, r.storage, Number(e.target.value) || 0)}
                          className="w-28 rounded-lg border border-line bg-bg px-2 py-1.5 tabular-nums outline-none focus:border-accent"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <p className="px-3 py-6 text-center text-fg-subtle text-sm">Sin resultados</p>
              )}
            </div>
            <p className="text-xs text-fg-subtle">{filtered.length} equipos · modelos se administran en Modelos</p>
          </section>
        ) : tab === 'penalties' ? (
          <section className="space-y-3">
            <p className="text-sm text-fg-muted">
              Deducciones del motor de precios. Porcentaje (0–1) o monto fijo en USD según el tipo.
            </p>
            <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
              <table className="min-w-full text-sm">
                <thead className="bg-bg-subtle text-left text-fg-muted">
                  <tr>
                    <th className="px-3 py-2.5 font-medium">Nombre</th>
                    <th className="px-3 py-2.5 font-medium">Tipo</th>
                    <th className="px-3 py-2.5 font-medium">Descuento actual</th>
                    <th className="px-3 py-2.5 font-medium">Valor editable</th>
                  </tr>
                </thead>
                <tbody>
                  {draft.penalties.map((p) => (
                    <tr key={p.key} className="border-t border-line">
                      <td className="px-3 py-2">
                        <p className="font-medium">{p.label || p.key}</p>
                        <p className="text-[11px] text-fg-subtle">{p.key}</p>
                      </td>
                      <td className="px-3 py-2 text-fg-muted">
                        {p.type === 'fixed_usd' ? 'USD fijo' : 'Porcentaje'}
                      </td>
                      <td className="px-3 py-2 tabular-nums">{formatPenaltyDisplay(p)}</td>
                      <td className="px-3 py-2">
                        <input
                          type="number"
                          step={p.type === 'percentage' ? 0.01 : 1}
                          min={0}
                          max={p.type === 'percentage' ? 1 : undefined}
                          value={p.value}
                          onChange={(e) => updatePenalty(p.key, Number(e.target.value))}
                          className="w-28 rounded-lg border border-line bg-bg px-2 py-1.5 tabular-nums outline-none focus:border-accent"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section className="space-y-4 max-w-lg">
            <p className="text-sm text-fg-muted">
              Parámetros generales. El umbral de batería se refleja en la clave `batteryBelow85` del motor.
            </p>
            <label className="block space-y-1.5">
              <span className="text-sm text-fg-muted">Moneda</span>
              <input
                value={draft.config.currency}
                onChange={(e) =>
                  setDraft({ ...draft, config: { ...draft.config, currency: e.target.value } })
                }
                className="w-full rounded-xl border border-line bg-surface px-3 py-2 outline-none focus:border-accent"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm text-fg-muted">Porcentaje mínimo de batería</span>
              <input
                type="number"
                min={1}
                max={100}
                value={draft.config.batteryThreshold}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    config: { ...draft.config, batteryThreshold: Number(e.target.value) || 85 },
                  })
                }
                className="w-full rounded-xl border border-line bg-surface px-3 py-2 outline-none focus:border-accent"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-sm text-fg-muted">Última actualización</span>
              <input
                value={draft.config.lastUpdated}
                readOnly
                className="w-full rounded-xl border border-line bg-bg-subtle px-3 py-2 text-fg-muted"
              />
            </label>
          </section>
        )}
      </main>
    </div>
  )
}
