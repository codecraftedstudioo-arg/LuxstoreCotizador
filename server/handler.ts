import {
  checkPassword,
  createSessionToken,
  isAuthenticated,
  sessionCookie,
  clearSessionCookie,
} from './auth.ts'
import { loadStore, saveStore, toPublicPayload } from './store.ts'
import type { CotizadorStore } from './types.ts'

function json(status: number, data: unknown, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  })
}

async function readBody(req: Request): Promise<unknown> {
  const text = await req.text()
  if (!text) return null
  return JSON.parse(text)
}

function pathOf(url: URL): string {
  return url.pathname.replace(/\/+$/, '') || '/'
}

export async function handleAdminApi(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const path = pathOf(url)
  const method = req.method.toUpperCase()

  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true',
      },
    })
  }

  if (path === '/api/v1/cotizador-prices' && method === 'GET') {
    try {
      const store = await loadStore()
      return json(200, toPublicPayload(store))
    } catch (err) {
      return json(500, { error: err instanceof Error ? err.message : 'Load failed' })
    }
  }

  if (path === '/api/admin/login' && method === 'POST') {
    try {
      const body = (await readBody(req)) as { password?: string } | null
      if (!body?.password || !checkPassword(body.password)) {
        return json(401, { error: 'Credenciales inválidas' })
      }
      const token = createSessionToken()
      return json(200, { ok: true }, { 'Set-Cookie': sessionCookie(token) })
    } catch {
      return json(400, { error: 'Solicitud inválida' })
    }
  }

  if (path === '/api/admin/logout' && method === 'POST') {
    return json(200, { ok: true }, { 'Set-Cookie': clearSessionCookie() })
  }

  if (path === '/api/admin/session' && method === 'GET') {
    return json(200, { authenticated: isAuthenticated(req) })
  }

  if (!isAuthenticated(req)) {
    return json(401, { error: 'No autenticado' })
  }

  if (path === '/api/admin/cotizador-prices' && method === 'GET') {
    try {
      const store = await loadStore()
      return json(200, store)
    } catch (err) {
      return json(500, { error: err instanceof Error ? err.message : 'Load failed' })
    }
  }

  if (path === '/api/admin/cotizador-prices' && method === 'PUT') {
    try {
      const body = (await readBody(req)) as CotizadorStore
      await saveStore(body)
      const store = await loadStore()
      return json(200, store)
    } catch (err) {
      return json(400, { error: err instanceof Error ? err.message : 'Save failed' })
    }
  }

  return json(404, { error: 'Not found' })
}
