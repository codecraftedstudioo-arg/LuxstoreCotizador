import { describe, it, expect, beforeEach, vi } from 'vitest'
import { isValidArgPhone, sendLeadToCrm } from './crm-webhook'

describe('isValidArgPhone', () => {
  it('acepta teléfono argentino de 10 dígitos', () => {
    expect(isValidArgPhone('1160050246')).toBe(true)
  })

  it('acepta formato 11 dígitos empezando con 9', () => {
    expect(isValidArgPhone('91160050246')).toBe(true)
  })

  it('acepta formato 12 dígitos con 54 prefix', () => {
    expect(isValidArgPhone('541160050246')).toBe(true)
  })

  it('acepta formato +549 13 dígitos', () => {
    expect(isValidArgPhone('5491160050246')).toBe(true)
  })

  it('acepta formato con espacios y guiones', () => {
    expect(isValidArgPhone('11-6005-0246')).toBe(true)
    expect(isValidArgPhone('+54 11 6005 0246')).toBe(true)
  })

  it('rechaza string vacío', () => {
    expect(isValidArgPhone('')).toBe(false)
  })

  it('rechaza menos de 10 dígitos', () => {
    expect(isValidArgPhone('123456')).toBe(false)
  })

  it('rechaza solo letras', () => {
    expect(isValidArgPhone('abcdefghij')).toBe(false)
  })

  it('rechaza más de 13 dígitos', () => {
    expect(isValidArgPhone('12345678901234')).toBe(false)
  })
})

describe('sendLeadToCrm — anti-spam', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 200 }))
  })

  it('descarta envío si el honeypot está lleno (bot)', async () => {
    const result = await sendLeadToCrm({
      nombre: 'Juan',
      telefono: '1160050246',
      modelo_actual: 'iPhone 15',
      almacenamiento_actual: '128',
      cotizacion_estimada: 350,
      honeypot: 'bot-filled-this',
    })
    expect(result).toBe(false)
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  it('descarta envío si falta nombre', async () => {
    const result = await sendLeadToCrm({
      nombre: '',
      telefono: '1160050246',
      modelo_actual: 'iPhone 15',
      almacenamiento_actual: '128',
      cotizacion_estimada: 350,
    })
    expect(result).toBe(false)
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  it('descarta envío si falta teléfono', async () => {
    const result = await sendLeadToCrm({
      nombre: 'Juan',
      telefono: '',
      modelo_actual: 'iPhone 15',
      almacenamiento_actual: '128',
      cotizacion_estimada: 350,
    })
    expect(result).toBe(false)
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  it('descarta envío si el teléfono no es válido', async () => {
    const result = await sendLeadToCrm({
      nombre: 'Juan',
      telefono: 'no-es-tel',
      modelo_actual: 'iPhone 15',
      almacenamiento_actual: '128',
      cotizacion_estimada: 350,
    })
    expect(result).toBe(false)
    expect(globalThis.fetch).not.toHaveBeenCalled()
  })

  it('envía lead válido al webhook', async () => {
    const result = await sendLeadToCrm({
      nombre: 'Juan Perez',
      telefono: '1160050246',
      modelo_actual: 'iPhone 15',
      almacenamiento_actual: '128',
      cotizacion_estimada: 350,
    })
    expect(result).toBe(true)
    expect(globalThis.fetch).toHaveBeenCalledTimes(1)
  })

  it('NO incluye el honeypot en el payload enviado', async () => {
    await sendLeadToCrm({
      nombre: 'Juan',
      telefono: '1160050246',
      modelo_actual: 'iPhone 15',
      almacenamiento_actual: '128',
      cotizacion_estimada: 350,
      honeypot: '',
    })
    const call = (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0]
    const body = JSON.parse(call[1].body)
    expect(body).not.toHaveProperty('honeypot')
    expect(body.nombre).toBe('Juan')
  })

  it('incluye datos de canje cuando vienen', async () => {
    await sendLeadToCrm({
      nombre: 'Juan',
      telefono: '1160050246',
      modelo_actual: 'iPhone 15',
      almacenamiento_actual: '128',
      cotizacion_estimada: 350,
      modelo_canje: 'iPhone 17 Pro',
      almacenamiento_canje: '256',
      color_canje: 'Orange',
      precio_canje: 1310,
    })
    const call = (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0]
    const body = JSON.parse(call[1].body)
    expect(body.modelo_canje).toBe('iPhone 17 Pro')
    expect(body.precio_canje).toBe(1310)
  })

  it('rate limiting: bloquea después de 3 envíos en 5 minutos', async () => {
    const lead = {
      nombre: 'Juan',
      telefono: '1160050246',
      modelo_actual: 'iPhone 15',
      almacenamiento_actual: '128',
      cotizacion_estimada: 350,
    }
    expect(await sendLeadToCrm(lead)).toBe(true)
    expect(await sendLeadToCrm(lead)).toBe(true)
    expect(await sendLeadToCrm(lead)).toBe(true)
    // Cuarto envío bloqueado
    expect(await sendLeadToCrm(lead)).toBe(false)
    expect(globalThis.fetch).toHaveBeenCalledTimes(3)
  })
})
