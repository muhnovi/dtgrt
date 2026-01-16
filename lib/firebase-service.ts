// Firebase service functions for CRUD operations
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, Timestamp } from "firebase/firestore"
import { db } from "./firebase"
import type { Penduduk, StatistikRT, DemografiJenisKelamin, DemografiUmur, DemografiPekerjaan } from "./types"
import { getFirestore } from "firebase/firestore"

const COLLECTION_NAME = "penduduk"

// Add new penduduk
export async function addPenduduk(data: Omit<Penduduk, "id">) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
    return { success: true, id: docRef.id }
  } catch (error) {
    console.error("Error adding penduduk:", error)
    return { success: false, error }
  }
}

// Get all penduduk
export async function getAllPenduduk(): Promise<Penduduk[]> {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME))
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Penduduk[]
  } catch (error) {
    console.error("Error getting penduduk:", error)
    return []
  }
}

// Get penduduk by RT
export async function getPendudukByRT(rt: string): Promise<Penduduk[]> {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("rt", "==", rt))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Penduduk[]
  } catch (error) {
    console.error("Error getting penduduk by RT:", error)
    return []
  }
}

// Update penduduk
export async function updatePenduduk(id: string, data: Partial<Penduduk>) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    })
    return { success: true }
  } catch (error) {
    console.error("Error updating penduduk:", error)
    return { success: false, error }
  }
}

// Delete penduduk
export async function deletePenduduk(id: string) {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id))
    return { success: true }
  } catch (error) {
    console.error("Error deleting penduduk:", error)
    return { success: false, error }
  }
}

// Get statistics by RT
export function getStatistikRT(pendudukList: Penduduk[]): StatistikRT[] {
  const rtStats = new Map<string, { penduduk: Set<string>; kk: Set<string> }>()

  pendudukList.forEach((p) => {
    if (!rtStats.has(p.rt)) {
      rtStats.set(p.rt, { penduduk: new Set(), kk: new Set() })
    }
    const stats = rtStats.get(p.rt)!
    stats.penduduk.add(p.nik)
    stats.kk.add(p.noKK)
  })

  return ["1", "2", "3", "4"].map((rt) => ({
    rt: rt as any,
    jumlahPenduduk: rtStats.get(rt)?.penduduk.size || 0,
    jumlahKK: rtStats.get(rt)?.kk.size || 0,
  }))
}

// Get gender demographics
export function getDemografiJenisKelamin(pendudukList: Penduduk[]): DemografiJenisKelamin {
  return {
    lakiLaki: pendudukList.filter((p) => p.jenisKelamin === "Laki-laki").length,
    perempuan: pendudukList.filter((p) => p.jenisKelamin === "Perempuan").length,
  }
}

// Get age demographics
export function getDemografiUmur(pendudukList: Penduduk[]): DemografiUmur[] {
  const ageCategories = {
    "0-5": 0,
    "6-12": 0,
    "13-17": 0,
    "18-25": 0,
    "26-35": 0,
    "36-45": 0,
    "46-55": 0,
    "56-65": 0,
    "65+": 0,
  }

  pendudukList.forEach((p) => {
    const age = p.umur
    if (age <= 5) ageCategories["0-5"]++
    else if (age <= 12) ageCategories["6-12"]++
    else if (age <= 17) ageCategories["13-17"]++
    else if (age <= 25) ageCategories["18-25"]++
    else if (age <= 35) ageCategories["26-35"]++
    else if (age <= 45) ageCategories["36-45"]++
    else if (age <= 55) ageCategories["46-55"]++
    else if (age <= 65) ageCategories["56-65"]++
    else ageCategories["65+"]++
  })

  return Object.entries(ageCategories).map(([kategori, jumlah]) => ({
    kategori,
    jumlah,
  }))
}

// Get occupation demographics
export function getDemografiPekerjaan(pendudukList: Penduduk[]): DemografiPekerjaan[] {
  const pekerjaanMap = new Map<string, number>()

  pendudukList.forEach((p) => {
    if (p.pekerjaan) {
      const count = pekerjaanMap.get(p.pekerjaan) || 0
      pekerjaanMap.set(p.pekerjaan, count + 1)
    }
  })

  return Array.from(pekerjaanMap, ([pekerjaan, jumlah]) => ({
    pekerjaan,
    jumlah,
  })).sort((a, b) => b.jumlah - a.jumlah)
}

// Calculate age from birth date
export function calculateAge(birthDate: string): number {
  if (!birthDate || typeof birthDate !== "string") {
    return 0
  }

  // Try to parse the birth date with multiple format attempts
  let birth = new Date(birthDate)

  // If invalid, try to parse other common formats
  if (isNaN(birth.getTime())) {
    // Try DD/MM/YYYY format
    const ddmmyyyy = birthDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (ddmmyyyy) {
      birth = new Date(`${ddmmyyyy[3]}-${ddmmyyyy[2]}-${ddmmyyyy[1]}`)
    }

    // Try DD-MM-YYYY format
    if (isNaN(birth.getTime())) {
      const ddmmyyyy2 = birthDate.match(/^(\d{2})-(\d{2})-(\d{4})$/)
      if (ddmmyyyy2) {
        birth = new Date(`${ddmmyyyy2[3]}-${ddmmyyyy2[2]}-${ddmmyyyy2[1]}`)
      }
    }
  }

  // If still invalid, return 0
  if (isNaN(birth.getTime())) {
    return 0
  }

  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age < 0 ? 0 : age
}

export async function autoFixInvalidBirthDates(): Promise<number> {
  try {
    const db = getFirestore()
    const pendudukRef = collection(db, "penduduk")
    const snapshot = await getDocs(pendudukRef)
    let fixedCount = 0

    for (const doc of snapshot.docs) {
      const penduduk = doc.data() as Penduduk

      // Check if birth date is invalid (calculateAge returns 0 but it's not supposed to)
      if (penduduk.tanggalLahir && isNaN(new Date(penduduk.tanggalLahir).getTime())) {
        // Try to parse with multiple formats
        let newDate = ""

        // Try DD/MM/YYYY format
        const ddmmyyyy = penduduk.tanggalLahir.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
        if (ddmmyyyy) {
          newDate = `${ddmmyyyy[3]}-${ddmmyyyy[2]}-${ddmmyyyy[1]}`
        }

        // Try DD-MM-YYYY format
        if (!newDate) {
          const ddmmyyyy2 = penduduk.tanggalLahir.match(/^(\d{2})-(\d{2})-(\d{4})$/)
          if (ddmmyyyy2) {
            newDate = `${ddmmyyyy2[3]}-${ddmmyyyy2[2]}-${ddmmyyyy2[1]}`
          }
        }

        if (newDate && !isNaN(new Date(newDate).getTime())) {
          // Update the document with corrected date
          await updateDoc(doc.ref, {
            tanggalLahir: newDate,
            umur: calculateAge(newDate),
          })
          fixedCount++
        }
      }
    }

    return fixedCount
  } catch (error) {
    console.error("Error fixing birth dates:", error)
    return 0
  }
}

// Refresh ages for all records based on birth dates
export async function refreshAllAges(pendudukList: Penduduk[]): Promise<void> {
  try {
    // Check if any record needs age update
    const today = new Date()

    for (const penduduk of pendudukList) {
      const currentAge = calculateAge(penduduk.tanggalLahir)

      // Update if age has changed
      if (currentAge !== penduduk.umur) {
        console.log(`[v0] Updating age for ${penduduk.nama}: ${penduduk.umur} -> ${currentAge}`)
        await updatePenduduk(penduduk.id || "", { umur: currentAge })
      }
    }
  } catch (error) {
    console.error("Error refreshing ages:", error)
  }
}
