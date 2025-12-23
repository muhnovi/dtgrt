import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, Timestamp } from "firebase/firestore"
import { db } from "./firebase"
import type { Penduduk, StatistikRT, DemografiJenisKelamin, DemografiUmur } from "./types"

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

// Calculate age from birth date
export function calculateAge(birthDate: string): number {
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}
