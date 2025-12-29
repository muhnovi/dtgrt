import type { Penduduk } from "./types"
import ExcelJS from "exceljs"

function getEducationCategory(pendidikan: string): string {
  const normalized = (pendidikan || "").toUpperCase().trim()

  // Kategorisasi: TAMAT SD = SD, TAMAT SMP/SMP = SLTP, TAMAT SMA/SMK/SMA/SMK = SLTA, Diploma = DIPLOMA

  // Handle "TAMAT" format
  if (normalized.includes("TAMAT SMA") || normalized.includes("TAMAT SMK")) {
    return "SLTA"
  }
  if (normalized.includes("TAMAT SMP")) {
    return "SLTP"
  }
  if (normalized.includes("TAMAT SD")) {
    return "SD"
  }
  if (normalized.includes("TAMAT S1")) {
    return "S1"
  }

  // Handle regular format (SMA, SMK, SMP, SD, etc)
  if (normalized.includes("SMA") || normalized.includes("SMK")) {
    return "SLTA"
  }
  if (normalized.includes("SMP") || normalized.includes("SLTP")) {
    return "SLTP"
  }
  if (normalized.includes("SD") && !normalized.includes("TAMAT")) {
    return "SD"
  }

  // Handle diploma
  if (
    normalized.includes("DIPLOMA") ||
    normalized.includes("D3") ||
    normalized.includes("D4") ||
    normalized.includes("D ")
  ) {
    return "DIPLOMA"
  }

  // Handle degree levels
  if (normalized.includes("S1") || normalized.includes("SARJANA")) return "S1"
  if (normalized.includes("S2") || normalized.includes("MAGISTER")) return "S2"
  if (normalized.includes("S3") || normalized.includes("DOKTOR")) return "S3"

  // Return original if no match (for PAUD, TK, BELUM SEKOLAH, TIDAK SEKOLAH, etc)
  return normalized
}

function sanitizeNoKK(noKK: string | undefined | null): string {
  if (!noKK || noKK.trim() === "") {
    return "[NO. KK TIDAK TERDAFTAR]"
  }
  return String(noKK).trim()
}

export async function exportAllRTWithStats(data: Penduduk[], filename: string) {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Data Penduduk")

  // Set column widths
  worksheet.columns = [
    { header: "No. KK", key: "noKK", width: 18 },
    { header: "NIK", key: "nik", width: 18 },
    { header: "Nama", key: "nama", width: 20 },
    { header: "Jenis Kelamin", key: "jenisKelamin", width: 15 },
    { header: "Tanggal Lahir", key: "tanggalLahir", width: 15 },
    { header: "Umur", key: "umur", width: 8 },
    { header: "Pendidikan", key: "pendidikan", width: 15 },
    { header: "Pekerjaan", key: "pekerjaan", width: 20 },
    { header: "RT", key: "rt", width: 8 },
  ]

  // Add data rows with proper number formatting
  data.forEach((p) => {
    worksheet.addRow({
      noKK: sanitizeNoKK(p.noKK),
      nik: p.nik,
      nama: p.nama,
      jenisKelamin: p.jenisKelamin,
      tanggalLahir: p.tanggalLahir,
      umur: p.umur,
      pendidikan: p.pendidikan,
      pekerjaan: p.pekerjaan,
      rt: `RT ${p.rt}`,
    })
  })

  // Format header row
  worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } }
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF2D7A3E" },
  }

  worksheet.getColumn("tanggalLahir").numFmt = "dd/mm/yyyy"

  // Format number columns as text to prevent scientific notation
  worksheet.getColumn("noKK").numFmt = "@"
  worksheet.getColumn("nik").numFmt = "@"

  // Add summary section
  const lastRow = worksheet.lastRow?.number || 1
  const summaryStartRow = lastRow + 3

  // Calculate statistics
  const rtStats = {
    "1": { laki: 0, perempuan: 0, kk: new Set<string>() },
    "2": { laki: 0, perempuan: 0, kk: new Set<string>() },
    "3": { laki: 0, perempuan: 0, kk: new Set<string>() },
    "4": { laki: 0, perempuan: 0, kk: new Set<string>() },
  }

  const pendidikanCount: Record<string, number> = {}

  data.forEach((p) => {
    const noKKValue = sanitizeNoKK(p.noKK)
    if (rtStats[p.rt as "1" | "2" | "3" | "4"]) {
      if (p.jenisKelamin === "Laki-laki") {
        rtStats[p.rt as "1" | "2" | "3" | "4"].laki++
      } else {
        rtStats[p.rt as "1" | "2" | "3" | "4"].perempuan++
      }
      // Only add to KK set if it's a real number, not the fallback text
      if (!noKKValue.includes("TIDAK TERDAFTAR")) {
        rtStats[p.rt as "1" | "2" | "3" | "4"].kk.add(noKKValue)
      }
    }

    const educationCategory = getEducationCategory(p.pendidikan)
    pendidikanCount[educationCategory] = (pendidikanCount[educationCategory] || 0) + 1
  })

  const totalLaki = Object.values(rtStats).reduce((sum, rt) => sum + rt.laki, 0)
  const totalPerempuan = Object.values(rtStats).reduce((sum, rt) => sum + rt.perempuan, 0)
  const totalPenduduk = totalLaki + totalPerempuan
  const totalKK = Object.values(rtStats).reduce((sum, rt) => sum + rt.kk.size, 0)

  // Add summary title
  worksheet.getCell(`A${summaryStartRow}`).value = "RINGKASAN DATA"
  worksheet.getCell(`A${summaryStartRow}`).font = { bold: true, size: 12 }

  let currentRow = summaryStartRow + 2
  worksheet.getCell(`A${currentRow}`).value = "GAROTAN"
  worksheet.getCell(`A${currentRow}`).font = { bold: true }
  currentRow++

  // Penduduk section
  worksheet.getCell(`A${currentRow}`).value = "PENDUDUK"
  worksheet.getCell(`A${currentRow}`).font = { bold: true }
  currentRow++

  worksheet.getCell(`A${currentRow}`).value = "RT01"
  worksheet.getCell(`B${currentRow}`).value = `L: ${rtStats["1"].laki}`
  worksheet.getCell(`C${currentRow}`).value = `P: ${rtStats["1"].perempuan}`
  currentRow++

  worksheet.getCell(`A${currentRow}`).value = "RT02"
  worksheet.getCell(`B${currentRow}`).value = `L: ${rtStats["2"].laki}`
  worksheet.getCell(`C${currentRow}`).value = `P: ${rtStats["2"].perempuan}`
  currentRow++

  worksheet.getCell(`A${currentRow}`).value = "RT03"
  worksheet.getCell(`B${currentRow}`).value = `L: ${rtStats["3"].laki}`
  worksheet.getCell(`C${currentRow}`).value = `P: ${rtStats["3"].perempuan}`
  currentRow++

  worksheet.getCell(`A${currentRow}`).value = "RT04"
  worksheet.getCell(`B${currentRow}`).value = `L: ${rtStats["4"].laki}`
  worksheet.getCell(`C${currentRow}`).value = `P: ${rtStats["4"].perempuan}`
  currentRow++

  worksheet.getCell(`A${currentRow}`).value = "JUMLAH"
  worksheet.getCell(`B${currentRow}`).value = `L: ${totalLaki}`
  worksheet.getCell(`C${currentRow}`).value = `P: ${totalPerempuan}`
  currentRow++

  worksheet.getCell(`A${currentRow}`).value = "TOTAL"
  worksheet.getCell(`B${currentRow}`).value = totalPenduduk
  worksheet.getCell(`A${currentRow}`).font = { bold: true }
  currentRow++

  // Kepala Keluarga section
  worksheet.getCell(`A${currentRow}`).value = "KEPALA KELUARGA"
  worksheet.getCell(`A${currentRow}`).font = { bold: true }
  currentRow++

  worksheet.getCell(`A${currentRow}`).value = "RT01"
  worksheet.getCell(`B${currentRow}`).value = `Total: ${rtStats["1"].kk.size}`
  currentRow++

  worksheet.getCell(`A${currentRow}`).value = "RT02"
  worksheet.getCell(`B${currentRow}`).value = `Total: ${rtStats["2"].kk.size}`
  currentRow++

  worksheet.getCell(`A${currentRow}`).value = "RT03"
  worksheet.getCell(`B${currentRow}`).value = `Total: ${rtStats["3"].kk.size}`
  currentRow++

  worksheet.getCell(`A${currentRow}`).value = "RT04"
  worksheet.getCell(`B${currentRow}`).value = `Total: ${rtStats["4"].kk.size}`
  currentRow++

  worksheet.getCell(`A${currentRow}`).value = "TOTAL"
  worksheet.getCell(`B${currentRow}`).value = totalKK
  worksheet.getCell(`A${currentRow}`).font = { bold: true }
  currentRow++

  // Education section
  worksheet.getCell(`A${currentRow}`).value = "MENEMPUH PENDIDIKAN"
  worksheet.getCell(`A${currentRow}`).font = { bold: true }
  currentRow++

  const educationOrder = ["SD", "SLTP", "SLTA", "DIPLOMA", "S1", "S2", "S3"]
  educationOrder.forEach((edu) => {
    const count = pendidikanCount[edu] || 0
    worksheet.getCell(`A${currentRow}`).value = edu
    worksheet.getCell(`B${currentRow}`).value = count
    currentRow++
  })

  // Save file
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${filename}.xlsx`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function exportSingleRT(data: Penduduk[], filename: string) {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet("Data Penduduk")

  const rtNumber = data.length > 0 ? data[0].rt : "1"

  // Set column widths
  worksheet.columns = [
    { header: "No. KK", key: "noKK", width: 18 },
    { header: "NIK", key: "nik", width: 18 },
    { header: "Nama", key: "nama", width: 20 },
    { header: "Jenis Kelamin", key: "jenisKelamin", width: 15 },
    { header: "Tanggal Lahir", key: "tanggalLahir", width: 15 },
    { header: "Umur", key: "umur", width: 8 },
    { header: "Pendidikan", key: "pendidikan", width: 15 },
    { header: "Pekerjaan", key: "pekerjaan", width: 20 },
    { header: "RT", key: "rt", width: 8 },
  ]

  // Add data rows
  data.forEach((p) => {
    worksheet.addRow({
      noKK: sanitizeNoKK(p.noKK),
      nik: p.nik,
      nama: p.nama,
      jenisKelamin: p.jenisKelamin,
      tanggalLahir: p.tanggalLahir,
      umur: p.umur,
      pendidikan: p.pendidikan,
      pekerjaan: p.pekerjaan,
      rt: `RT ${p.rt}`,
    })
  })

  // Format header row
  worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } }
  worksheet.getRow(1).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF2D7A3E" },
  }

  worksheet.getColumn("tanggalLahir").numFmt = "dd/mm/yyyy"

  // Format number columns as text
  worksheet.getColumn("noKK").numFmt = "@"
  worksheet.getColumn("nik").numFmt = "@"

  // Calculate statistics
  let laki = 0
  let perempuan = 0
  const kkSet = new Set<string>()
  const pendidikanCount: Record<string, number> = {}

  data.forEach((p) => {
    if (p.jenisKelamin === "Laki-laki") {
      laki++
    } else {
      perempuan++
    }
    const noKKValue = sanitizeNoKK(p.noKK)
    // Only add to KK set if it's a real number
    if (!noKKValue.includes("TIDAK TERDAFTAR")) {
      kkSet.add(noKKValue)
    }

    const educationCategory = getEducationCategory(p.pendidikan)
    pendidikanCount[educationCategory] = (pendidikanCount[educationCategory] || 0) + 1
  })

  const totalPenduduk = laki + perempuan
  const totalKK = kkSet.size

  // Add summary section
  const lastRow = worksheet.lastRow?.number || 1
  const summaryStartRow = lastRow + 3

  worksheet.getCell(`A${summaryStartRow}`).value = "RINGKASAN DATA"
  worksheet.getCell(`A${summaryStartRow}`).font = { bold: true, size: 12 }

  let currentRow = summaryStartRow + 2
  worksheet.getCell(`A${currentRow}`).value = `GAROTAN RT ${rtNumber}`
  worksheet.getCell(`A${currentRow}`).font = { bold: true }
  currentRow++

  // Penduduk section
  worksheet.getCell(`A${currentRow}`).value = "PENDUDUK"
  worksheet.getCell(`A${currentRow}`).font = { bold: true }
  currentRow++

  worksheet.getCell(`A${currentRow}`).value = `RT0${rtNumber}`
  worksheet.getCell(`B${currentRow}`).value = `L: ${laki}`
  worksheet.getCell(`C${currentRow}`).value = `P: ${perempuan}`
  currentRow++

  worksheet.getCell(`A${currentRow}`).value = "TOTAL"
  worksheet.getCell(`B${currentRow}`).value = totalPenduduk
  worksheet.getCell(`A${currentRow}`).font = { bold: true }
  currentRow++

  // Kepala Keluarga section
  worksheet.getCell(`A${currentRow}`).value = "KEPALA KELUARGA"
  worksheet.getCell(`A${currentRow}`).font = { bold: true }
  currentRow++

  worksheet.getCell(`A${currentRow}`).value = `RT0${rtNumber}`
  worksheet.getCell(`B${currentRow}`).value = `Total: ${totalKK}`
  currentRow++

  // Education section
  worksheet.getCell(`A${currentRow}`).value = "MENEMPUH PENDIDIKAN"
  worksheet.getCell(`A${currentRow}`).font = { bold: true }
  currentRow++

  const educationOrder = ["SD", "SLTP", "SLTA", "DIPLOMA", "S1", "S2", "S3"]
  educationOrder.forEach((edu) => {
    const count = pendidikanCount[edu] || 0
    worksheet.getCell(`A${currentRow}`).value = edu
    worksheet.getCell(`B${currentRow}`).value = count
    currentRow++
  })

  // Save file
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${filename}.xlsx`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
