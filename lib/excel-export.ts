import type { Penduduk } from "./types"

export function exportAllRTWithStats(data: Penduduk[], filename: string) {
  // Calculate statistics
  const rtStats = {
    "1": { laki: 0, perempuan: 0, kk: new Set<string>() },
    "2": { laki: 0, perempuan: 0, kk: new Set<string>() },
    "3": { laki: 0, perempuan: 0, kk: new Set<string>() },
    "4": { laki: 0, perempuan: 0, kk: new Set<string>() },
  }

  const pendidikanCount: Record<string, number> = {}

  data.forEach((p) => {
    // Count by RT and gender
    if (rtStats[p.rt as "1" | "2" | "3" | "4"]) {
      if (p.jenisKelamin === "Laki-laki") {
        rtStats[p.rt as "1" | "2" | "3" | "4"].laki++
      } else {
        rtStats[p.rt as "1" | "2" | "3" | "4"].perempuan++
      }
      rtStats[p.rt as "1" | "2" | "3" | "4"].kk.add(p.noKK)
    }

    // Count education
    const pendidikan = p.pendidikan || "Tidak Ada"
    pendidikanCount[pendidikan] = (pendidikanCount[pendidikan] || 0) + 1
  })

  // Calculate totals
  const totalLaki = Object.values(rtStats).reduce((sum, rt) => sum + rt.laki, 0)
  const totalPerempuan = Object.values(rtStats).reduce((sum, rt) => sum + rt.perempuan, 0)
  const totalPenduduk = totalLaki + totalPerempuan
  const totalKK = Object.values(rtStats).reduce((sum, rt) => sum + rt.kk.size, 0)

  // Create CSV content
  const lines: string[] = []

  lines.push('"===== DATA LENGKAP PENDUDUK ====="')
  lines.push('""')

  const headers = ["No. KK", "NIK", "Nama", "Jenis Kelamin", "Tanggal Lahir", "Umur", "Pendidikan", "Pekerjaan", "RT"]
  lines.push(headers.map((h) => `"${h}"`).join(","))

  // Data rows
  data.forEach((p) => {
    const row = [
      `\t${p.noKK}`,
      `\t${p.nik}`,
      p.nama,
      p.jenisKelamin,
      p.tanggalLahir,
      p.umur.toString(),
      p.pendidikan,
      p.pekerjaan,
      `RT ${p.rt}`,
    ]
    lines.push(row.map((cell) => `"${cell}"`).join(","))
  })

  lines.push('""')
  lines.push('""')
  lines.push('"===== RINGKASAN DATA ====="')
  lines.push('""')
  lines.push('"GAROTAN"')
  lines.push('""')

  // Penduduk section
  lines.push('"PENDUDUK"')
  lines.push(`"RT01","L: ${rtStats["1"].laki}","P: ${rtStats["1"].perempuan}"`)
  lines.push(`"RT02","L: ${rtStats["2"].laki}","P: ${rtStats["2"].perempuan}"`)
  lines.push(`"RT03","L: ${rtStats["3"].laki}","P: ${rtStats["3"].perempuan}"`)
  lines.push(`"RT04","L: ${rtStats["4"].laki}","P: ${rtStats["4"].perempuan}"`)
  lines.push(`"JUMLAH","L: ${totalLaki}","P: ${totalPerempuan}"`)
  lines.push(`"TOTAL",": ${totalPenduduk}",""`)
  lines.push('""')

  // Kepala Keluarga section
  lines.push('"KEPALA KELUARGA"')
  lines.push(`"RT01","Total: ${rtStats["1"].kk.size}",""`)
  lines.push(`"RT02","Total: ${rtStats["2"].kk.size}",""`)
  lines.push(`"RT03","Total: ${rtStats["3"].kk.size}",""`)
  lines.push(`"RT04","Total: ${rtStats["4"].kk.size}",""`)
  lines.push(`"TOTAL",": ${totalKK}",""`)
  lines.push('""')

  // Education section
  lines.push('"MENEMPUH PENDIDIKAN"')
  const educationOrder = ["SD", "SLTP", "SLTA", "S1", "S2", "S3"]
  educationOrder.forEach((edu) => {
    const count = pendidikanCount[edu] || 0
    lines.push(`"${edu}",": ${count}",""`)
  })

  const csvContent = lines.join("\n")

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

export function exportSingleRT(data: Penduduk[], filename: string) {
  const rtNumber = data.length > 0 ? data[0].rt : "1"

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
    kkSet.add(p.noKK)

    const pendidikan = p.pendidikan || "Tidak Ada"
    pendidikanCount[pendidikan] = (pendidikanCount[pendidikan] || 0) + 1
  })

  const totalPenduduk = laki + perempuan
  const totalKK = kkSet.size

  // Create CSV content
  const lines: string[] = []

  // Data table header
  lines.push(`"===== DATA PENDUDUK RT ${rtNumber} ====="`)
  lines.push('""')

  const headers = ["No. KK", "NIK", "Nama", "Jenis Kelamin", "Tanggal Lahir", "Umur", "Pendidikan", "Pekerjaan", "RT"]
  lines.push(headers.map((h) => `"${h}"`).join(","))

  // Data rows
  data.forEach((p) => {
    const row = [
      `\t${p.noKK}`,
      `\t${p.nik}`,
      p.nama,
      p.jenisKelamin,
      p.tanggalLahir,
      p.umur.toString(),
      p.pendidikan,
      p.pekerjaan,
      `RT ${p.rt}`,
    ]
    lines.push(row.map((cell) => `"${cell}"`).join(","))
  })

  lines.push('""')
  lines.push('""')
  lines.push('"===== RINGKASAN DATA ====="')
  lines.push('""')
  lines.push(`"GAROTAN RT ${rtNumber}"`)
  lines.push('""')

  // Penduduk section
  lines.push('"PENDUDUK"')
  lines.push(`"RT0${rtNumber}","L: ${laki}","P: ${perempuan}"`)
  lines.push(`"TOTAL",": ${totalPenduduk}",""`)
  lines.push('""')

  // Kepala Keluarga section
  lines.push('"KEPALA KELUARGA"')
  lines.push(`"RT0${rtNumber}","Total: ${totalKK}",""`)
  lines.push('""')

  // Education section
  lines.push('"MENEMPUH PENDIDIKAN"')
  const educationOrder = ["SD", "SLTP", "SLTA", "S1", "S2", "S3"]
  educationOrder.forEach((edu) => {
    const count = pendidikanCount[edu] || 0
    lines.push(`"${edu}",": ${count}",""`)
  })

  const csvContent = lines.join("\n")

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
