import { describe, it, expect } from 'vitest'
import { isValidArgPhone } from './phone'

describe('isValidArgPhone', () => {
  it('acepta 10 dígitos locales', () => {
    expect(isValidArgPhone('1160050246')).toBe(true)
  })

  it('acepta 11 dígitos con 9', () => {
    expect(isValidArgPhone('91160050246')).toBe(true)
  })

  it('acepta 12 dígitos con 54', () => {
    expect(isValidArgPhone('541160050246')).toBe(true)
  })

  it('acepta 13 dígitos con 549', () => {
    expect(isValidArgPhone('5491160050246')).toBe(true)
  })

  it('acepta formatos con espacios y símbolos', () => {
    expect(isValidArgPhone('11-6005-0246')).toBe(true)
    expect(isValidArgPhone('+54 11 6005 0246')).toBe(true)
  })

  it('rechaza vacío', () => {
    expect(isValidArgPhone('')).toBe(false)
  })

  it('rechaza muy corto', () => {
    expect(isValidArgPhone('123456')).toBe(false)
  })

  it('rechaza letras', () => {
    expect(isValidArgPhone('abcdefghij')).toBe(false)
  })

  it('rechaza demasiado largo', () => {
    expect(isValidArgPhone('12345678901234')).toBe(false)
  })

  it('rechaza todos ceros / dígitos iguales', () => {
    expect(isValidArgPhone('0000000000')).toBe(false)
    expect(isValidArgPhone('5490000000000')).toBe(false)
  })

  it('rechaza secuencias obvias', () => {
    expect(isValidArgPhone('1234567890')).toBe(false)
    expect(isValidArgPhone('5491234567890')).toBe(false)
  })

  it('rechaza baja variedad de dígitos', () => {
    expect(isValidArgPhone('1212121212')).toBe(false)
    expect(isValidArgPhone('5491212121212')).toBe(false)
  })

  it('acepta número válido típico', () => {
    expect(isValidArgPhone('1156789012')).toBe(true)
    expect(isValidArgPhone('5491156789012')).toBe(true)
  })
})
