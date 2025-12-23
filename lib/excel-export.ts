import type { Penduduk } from "./types"

// Function to export data to Excel (CSV format)
export function exportToExcel(data: Penduduk[], filename: string) {
  // Create CSV header
  const headers = ["No. KK", "NIK", "Nama", "Jenis Kelamin", "Tanggal Lahir", "Umur", "Pendidikan", "Pekerjaan", "RT"]

  // Create CSV rows
  const rows = data.map((p) => [
    `\t${p.noKK}`, // Tab prefix forces text format in Excel
    `\t${p.nik}`, // Tab prefix forces text format in Excel
    p.nama,
    p.jenisKelamin,
    p.tanggalLahir,
    p.umur.toString(),
    p.pendidikan,
    p.pekerjaan,
    `RT ${p.rt}`,
  ])

  // Combine headers and rows
  const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

  // Create blob and download
  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
