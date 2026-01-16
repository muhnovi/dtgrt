export function normalizeDateFormat(dateString: string): string {
  if (!dateString) return ""

  // Jika sudah dalam format YYYY-MM-DD, return langsung
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString
  }

  // Jika dalam format DD/MM/YYYY, konversi ke YYYY-MM-DD
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    const [day, month, year] = dateString.split("/")
    return `${year}-${month}-${day}`
  }

  // Jika dalam format DD-MM-YYYY, konversi ke YYYY-MM-DD
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) {
    const [day, month, year] = dateString.split("-")
    return `${year}-${month}-${day}`
  }

  // Try parsing as Date object
  const date = new Date(dateString)
  if (!isNaN(date.getTime())) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  return ""
}

export function formatDateForDisplay(dateString: string): string {
  if (!dateString) return ""

  const normalized = normalizeDateFormat(dateString)
  if (!normalized) return ""

  const [year, month, day] = normalized.split("-")
  return `${day}/${month}/${year}`
}
