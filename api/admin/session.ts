import type { IncomingMessage, ServerResponse } from 'node:http'
import { handleAdminApi } from '../../server/handler.ts'

async function toWebRequest(req: IncomingMessage, pathname: string): Promise<Request> {
  const host = req.headers.host || 'localhost'
  const proto = (req.headers['x-forwarded-proto'] as string) || 'http'
  const headers = new Headers()
  for (const [k, v] of Object.entries(req.headers)) {
    if (v == null) continue
    headers.set(k, Array.isArray(v) ? v.join(',') : v)
  }
  return new Request(`${proto}://${host}${pathname}`, {
    method: (req.method || 'GET').toUpperCase(),
    headers,
  })
}

async function send(res: ServerResponse, response: Response): Promise<void> {
  res.statusCode = response.status
  response.headers.forEach((value, key) => res.setHeader(key, value))
  res.end(Buffer.from(await response.arrayBuffer()))
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    await send(res, await handleAdminApi(await toWebRequest(req, '/api/admin/session')))
  } catch (err) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Server error' }))
  }
}
