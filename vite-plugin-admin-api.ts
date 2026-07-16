import type { Plugin } from 'vite'
import { handleAdminApi } from './server/handler.ts'

/**
 * Dev middleware: exposes the same /api routes used in production (Vercel).
 */
export function adminApiPlugin(): Plugin {
  return {
    name: 'luxstore-admin-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || ''
        if (!url.startsWith('/api/')) return next()

        try {
          const host = req.headers.host || 'localhost'
          const fullUrl = `http://${host}${url}`
          const chunks: Buffer[] = []
          await new Promise<void>((resolve, reject) => {
            req.on('data', (c) => chunks.push(Buffer.from(c)))
            req.on('end', () => resolve())
            req.on('error', reject)
          })
          const body = Buffer.concat(chunks)

          const headers = new Headers()
          for (const [k, v] of Object.entries(req.headers)) {
            if (v == null) continue
            headers.set(k, Array.isArray(v) ? v.join(',') : v)
          }

          const method = (req.method || 'GET').toUpperCase()
          const request = new Request(fullUrl, {
            method,
            headers,
            body: method === 'GET' || method === 'HEAD' ? undefined : body,
          })

          const result = await handleAdminApi(request)
          res.statusCode = result.status
          result.headers.forEach((value, key) => {
            res.setHeader(key, value)
          })
          res.end(Buffer.from(await result.arrayBuffer()))
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'Server error' }))
        }
      })
    },
  }
}
