import type { IncomingMessage, ServerResponse } from 'node:http'
import { handleAdminApi } from '../../server/handler.ts'

async function toWebRequest(req: IncomingMessage, pathname: string): Promise<Request> {
  const host = req.headers.host || 'localhost'
  const proto = (req.headers['x-forwarded-proto'] as string) || 'http'
  const url = `${proto}://${host}${pathname}`

  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  const body = Buffer.concat(chunks)

  const headers = new Headers()
  for (const [k, v] of Object.entries(req.headers)) {
    if (v == null) continue
    headers.set(k, Array.isArray(v) ? v.join(',') : v)
  }

  const method = (req.method || 'GET').toUpperCase()
  return new Request(url, {
    method,
    headers,
    body: method === 'GET' || method === 'HEAD' ? undefined : body,
  })
}

async function send(res: ServerResponse, response: Response): Promise<void> {
  res.statusCode = response.status
  response.headers.forEach((value, key) => {
    res.setHeader(key, value)
  })
  const buf = Buffer.from(await response.arrayBuffer())
  res.end(buf)
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const request = await toWebRequest(req, '/api/v1/cotizador-prices')
    await send(res, await handleAdminApi(request))
  } catch (err) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Server error' }))
  }
}
