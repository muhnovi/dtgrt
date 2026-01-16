export function validateNIK(nik: string): { valid: boolean; error?: string } {
  const trimmedNIK = nik.trim()

  if (!trimmedNIK) {
    return { valid: false, error: "NIK tidak boleh kosong" }
  }

  if (!/^\d+$/.test(trimmedNIK)) {
    return { valid: false, error: "NIK hanya boleh berisi angka" }
  }

  if (trimmedNIK.length !== 16) {
    return { valid: false, error: `NIK harus 16 angka (saat ini: ${trimmedNIK.length} angka)` }
  }

  return { valid: true }
}

export function validateNoKK(noKK: string): { valid: boolean; error?: string } {
  const trimmedNoKK = noKK.trim()

  if (!trimmedNoKK) {
    return { valid: false, error: "No. KK tidak boleh kosong" }
  }

  if (!/^\d+$/.test(trimmedNoKK)) {
    return { valid: false, error: "No. KK hanya boleh berisi angka" }
  }

  if (trimmedNoKK.length !== 16) {
    return { valid: false, error: `No. KK harus 16 angka (saat ini: ${trimmedNoKK.length} angka)` }
  }

  return { valid: true }
}

export function validateIdentityNumbers(noKK: string, nik: string): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  const noKKValidation = validateNoKK(noKK)
  if (!noKKValidation.valid) {
    errors.noKK = noKKValidation.error || "No. KK tidak valid"
  }

  const nikValidation = validateNIK(nik)
  if (!nikValidation.valid) {
    errors.nik = nikValidation.error || "NIK tidak valid"
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  }
}
