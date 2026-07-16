import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto'

const COOKIE_NAME = 'lux_admin_session'
const MAX_AGE_SEC = 60 * 60 * 12 // 12h

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'dev-only-change-me'
}

function expectedPassword(): string {
  return process.env.ADMIN_PASSWORD || 'luxstore-admin'
}

export function checkPassword(password: string): boolean {
  const expected = expectedPassword()
  const a = Buffer.from(password)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url')
}

export function createSessionToken(): string {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC
  const nonce = randomBytes(8).toString('hex')
  const payload = `admin.${exp}.${nonce}`
  return `${payload}.${sign(payload)}`
}

export function verifySessionToken(token: string | null | undefined): boolean {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 4) return false
  const [role, expStr, nonce, sig] = parts
  if (role !== 'admin' || !expStr || !nonce || !sig) return false
  const payload = `${role}.${expStr}.${nonce}`
  const expected = sign(payload)
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false
  const exp = Number(expStr)
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false
  return true
}

export function parseCookies(header: string | null | undefined): Record<string, string> {
  const out: Record<string, string> = {}
  if (!header) return out
  for (const part of header.split(';')) {
    const idx = part.indexOf('=')
    if (idx === -1) continue
    const key = part.slice(0, idx).trim()
    const val = part.slice(idx + 1).trim()
    out[key] = decodeURIComponent(val)
  }
  return out
}

export function getSessionFromRequest(req: { headers: Headers | Record<string, string | string[] | undefined> }): string | null {
  const headers = req.headers
  let cookieHeader: string | null = null
  if (headers instanceof Headers) {
    cookieHeader = headers.get('cookie')
  } else {
    const raw = headers.cookie ?? headers.Cookie
    cookieHeader = Array.isArray(raw) ? raw[0] : raw ?? null
  }
  const cookies = parseCookies(cookieHeader)
  return cookies[COOKIE_NAME] ?? null
}

export function isAuthenticated(req: { headers: Headers | Record<string, string | string[] | undefined> }): boolean {
  return verifySessionToken(getSessionFromRequest(req))
}

export function sessionCookie(token: string): string {
  const secure = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${MAX_AGE_SEC}${secure ? '; Secure' : ''}`
}

export function clearSessionCookie(): string {
  const secure = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1'
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? '; Secure' : ''}`
}

export { COOKIE_NAME }
