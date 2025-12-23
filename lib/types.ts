// Type definitions for the village demographic system
export type JenisKelamin = "Laki-laki" | "Perempuan"

export type Pendidikan = "Tidak Sekolah" | "SD" | "SMP" | "SMA/SMK" | "D3" | "S1" | "S2" | "S3"

export type RT = "1" | "2" | "3" | "4"

export interface Penduduk {
  id?: string
  noKK: string
  nama: string
  nik: string
  jenisKelamin: JenisKelamin
  tanggalLahir: string
  umur: number
  pendidikan: Pendidikan
  pekerjaan: string
  rt: RT
  createdAt?: Date
  updatedAt?: Date
}

export interface StatistikRT {
  rt: RT
  jumlahPenduduk: number
  jumlahKK: number
}

export interface DemografiJenisKelamin {
  lakiLaki: number
  perempuan: number
}

export interface DemografiUmur {
  kategori: string
  jumlah: number
}

export interface DemografiPekerjaan {
  pekerjaan: string
  jumlah: number
}
