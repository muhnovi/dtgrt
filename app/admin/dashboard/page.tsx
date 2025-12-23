"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { LogOut, Plus, Trash2, Users, Download, Edit, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Footer } from "@/components/footer"
import { addPenduduk, getAllPenduduk, deletePenduduk, updatePenduduk, calculateAge } from "@/lib/firebase-service"
import { exportToExcel } from "@/lib/excel-export"
import type { Penduduk, JenisKelamin, Pendidikan, RT } from "@/lib/types"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [pendudukList, setPendudukList] = useState<Penduduk[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [formData, setFormData] = useState({
    noKK: "",
    nama: "",
    nik: "",
    jenisKelamin: "Laki-laki" as JenisKelamin,
    tanggalLahir: "",
    umur: 0,
    pendidikan: "SD" as Pendidikan,
    pekerjaan: "",
    rt: "1" as RT,
  })

  useEffect(() => {
    checkAuth()
    loadData()
  }, [])

  const checkAuth = () => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push("/admin/login")
      }
    })
    return unsubscribe
  }

  const loadData = async () => {
    setLoading(true)
    const data = await getAllPenduduk()
    const sortedData = data.sort((a, b) => {
      const rtA = Number.parseInt(a.rt)
      const rtB = Number.parseInt(b.rt)
      return rtA - rtB
    })
    setPendudukList(sortedData)
    setLoading(false)
  }

  const handleLogout = async () => {
    try {
      await auth.signOut()
      toast({
        title: "Logout berhasil",
        description: "Anda telah keluar dari sistem",
      })
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const handleTanggalLahirChange = (tanggalLahir: string) => {
    const age = calculateAge(tanggalLahir)
    setFormData({
      ...formData,
      tanggalLahir,
      umur: age,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let result
    if (editMode && editId) {
      result = await updatePenduduk(editId, formData)
    } else {
      result = await addPenduduk(formData)
    }

    if (result.success) {
      toast({
        title: editMode ? "Data berhasil diperbarui" : "Data berhasil ditambahkan",
        description: editMode
          ? `Data penduduk ${formData.nama} telah diperbarui`
          : `Data penduduk ${formData.nama} telah disimpan`,
      })

      setFormData({
        noKK: "",
        nama: "",
        nik: "",
        jenisKelamin: "Laki-laki",
        tanggalLahir: "",
        umur: 0,
        pendidikan: "SD",
        pekerjaan: "",
        rt: "1",
      })
      setShowForm(false)
      setEditMode(false)
      setEditId(null)
      loadData()
    } else {
      toast({
        title: editMode ? "Gagal memperbarui data" : "Gagal menambahkan data",
        description: "Terjadi kesalahan saat menyimpan data",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (penduduk: Penduduk) => {
    setFormData({
      noKK: penduduk.noKK,
      nama: penduduk.nama,
      nik: penduduk.nik,
      jenisKelamin: penduduk.jenisKelamin,
      tanggalLahir: penduduk.tanggalLahir,
      umur: penduduk.umur,
      pendidikan: penduduk.pendidikan,
      pekerjaan: penduduk.pekerjaan,
      rt: penduduk.rt,
    })
    setEditMode(true)
    setEditId(penduduk.id!)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleCancelEdit = () => {
    setFormData({
      noKK: "",
      nama: "",
      nik: "",
      jenisKelamin: "Laki-laki",
      tanggalLahir: "",
      umur: 0,
      pendidikan: "SD",
      pekerjaan: "",
      rt: "1",
    })
    setShowForm(false)
    setEditMode(false)
    setEditId(null)
  }

  const handleDelete = async (id: string, nama: string) => {
    if (!confirm(`Hapus data ${nama}?`)) return

    const result = await deletePenduduk(id)

    if (result.success) {
      toast({
        title: "Data berhasil dihapus",
        description: `Data ${nama} telah dihapus`,
      })
      loadData()
    } else {
      toast({
        title: "Gagal menghapus data",
        description: "Terjadi kesalahan",
        variant: "destructive",
      })
    }
  }

  const handleExportAll = () => {
    exportToExcel(pendudukList, `Data_Penduduk_RW7_Semua_RT_${new Date().toISOString().split("T")[0]}`)
    toast({
      title: "Download berhasil",
      description: "Data semua RT berhasil didownload",
    })
  }

  const handleExportByRT = (rt: string) => {
    const filteredData = pendudukList.filter((p) => p.rt === rt)
    exportToExcel(filteredData, `Data_Penduduk_RT${rt}_${new Date().toISOString().split("T")[0]}`)
    toast({
      title: "Download berhasil",
      description: `Data RT ${rt} berhasil didownload`,
    })
  }

  const filteredPendudukList = pendudukList.filter((penduduk) => {
    const query = searchQuery.toLowerCase()
    return (
      penduduk.nama.toLowerCase().includes(query) ||
      penduduk.nik.toLowerCase().includes(query) ||
      penduduk.noKK.toLowerCase().includes(query) ||
      penduduk.pekerjaan.toLowerCase().includes(query) ||
      `rt ${penduduk.rt}`.toLowerCase().includes(query)
    )
  })

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <motion.header
        className="bg-primary text-primary-foreground py-4 sm:py-6 px-4 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 sm:w-8 sm:h-8" />
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-primary-foreground/80 mt-1 text-sm sm:text-base">Kelola Data Penduduk Desa</p>
            </div>
          </div>
          <Button variant="secondary" onClick={handleLogout} className="gap-2 w-full sm:w-auto">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Data Penduduk</h2>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button variant="outline" onClick={handleExportAll} className="gap-2 bg-transparent w-full sm:w-auto">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download Semua RT</span>
              <span className="sm:hidden">Download Semua</span>
            </Button>
            <Button onClick={() => setShowForm(!showForm)} className="gap-2 w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              {showForm ? "Tutup Form" : "Tambah Data"}
            </Button>
          </div>
        </div>

        <Card className="p-4">
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 items-start sm:items-center">
            <span className="text-sm font-medium text-muted-foreground">Download per RT:</span>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {["1", "2", "3", "4"].map((rt) => (
                <Button
                  key={rt}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleExportByRT(rt)}
                  className="gap-2 flex-1 sm:flex-initial"
                >
                  <Download className="w-3 h-3" />
                  RT {rt}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari berdasarkan nama, NIK, No. KK, pekerjaan, atau RT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              Ditemukan {filteredPendudukList.length} dari {pendudukList.length} data
            </p>
          )}
        </Card>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-foreground">
                {editMode ? "Edit Data Penduduk" : "Tambah Data Penduduk"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="noKK">No. KK</Label>
                    <Input
                      id="noKK"
                      value={formData.noKK}
                      onChange={(e) => setFormData({ ...formData, noKK: e.target.value })}
                      required
                      placeholder="3201010101010001"
                    />
                  </div>

                  <div>
                    <Label htmlFor="nik">NIK</Label>
                    <Input
                      id="nik"
                      value={formData.nik}
                      onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                      required
                      placeholder="3201010101010001"
                    />
                  </div>

                  <div>
                    <Label htmlFor="nama">Nama Lengkap</Label>
                    <Input
                      id="nama"
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      required
                      placeholder="Nama Lengkap"
                    />
                  </div>

                  <div>
                    <Label htmlFor="jenisKelamin">Jenis Kelamin</Label>
                    <Select
                      value={formData.jenisKelamin}
                      onValueChange={(value) => setFormData({ ...formData, jenisKelamin: value as JenisKelamin })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                        <SelectItem value="Perempuan">Perempuan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
                    <Input
                      id="tanggalLahir"
                      type="date"
                      value={formData.tanggalLahir}
                      onChange={(e) => handleTanggalLahirChange(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="umur">Umur (Tahun)</Label>
                    <Input id="umur" type="number" value={formData.umur} readOnly className="bg-muted" />
                  </div>

                  <div>
                    <Label htmlFor="pendidikan">Pendidikan</Label>
                    <Select
                      value={formData.pendidikan}
                      onValueChange={(value) => setFormData({ ...formData, pendidikan: value as Pendidikan })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Tidak Sekolah">Tidak Sekolah</SelectItem>
                        <SelectItem value="SD">SD</SelectItem>
                        <SelectItem value="SMP">SMP</SelectItem>
                        <SelectItem value="SMA/SMK">SMA/SMK</SelectItem>
                        <SelectItem value="D3">D3</SelectItem>
                        <SelectItem value="S1">S1</SelectItem>
                        <SelectItem value="S2">S2</SelectItem>
                        <SelectItem value="S3">S3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="pekerjaan">Pekerjaan</Label>
                    <Input
                      id="pekerjaan"
                      value={formData.pekerjaan}
                      onChange={(e) => setFormData({ ...formData, pekerjaan: e.target.value })}
                      required
                      placeholder="Pekerjaan"
                    />
                  </div>

                  <div>
                    <Label htmlFor="rt">RT</Label>
                    <Select
                      value={formData.rt}
                      onValueChange={(value) => setFormData({ ...formData, rt: value as RT })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">RT 1</SelectItem>
                        <SelectItem value="2">RT 2</SelectItem>
                        <SelectItem value="3">RT 3</SelectItem>
                        <SelectItem value="4">RT 4</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button type="submit" className="gap-2 w-full sm:w-auto">
                    {editMode ? (
                      <>
                        <Edit className="w-4 h-4" />
                        Perbarui Data
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Simpan Data
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="w-full sm:w-auto bg-transparent"
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        <Card className="p-4 sm:p-6">
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">No. KK</TableHead>
                  <TableHead className="whitespace-nowrap">NIK</TableHead>
                  <TableHead className="whitespace-nowrap">Nama</TableHead>
                  <TableHead className="whitespace-nowrap">Jenis Kelamin</TableHead>
                  <TableHead className="whitespace-nowrap">Umur</TableHead>
                  <TableHead className="whitespace-nowrap">Pendidikan</TableHead>
                  <TableHead className="whitespace-nowrap">Pekerjaan</TableHead>
                  <TableHead className="whitespace-nowrap">RT</TableHead>
                  <TableHead className="whitespace-nowrap">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPendudukList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                      {searchQuery ? "Tidak ada data yang sesuai dengan pencarian" : "Belum ada data penduduk"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPendudukList.map((penduduk) => (
                    <TableRow key={penduduk.id}>
                      <TableCell className="whitespace-nowrap">{penduduk.noKK}</TableCell>
                      <TableCell className="whitespace-nowrap">{penduduk.nik}</TableCell>
                      <TableCell className="whitespace-nowrap">{penduduk.nama}</TableCell>
                      <TableCell className="whitespace-nowrap">{penduduk.jenisKelamin}</TableCell>
                      <TableCell className="whitespace-nowrap">{penduduk.umur} tahun</TableCell>
                      <TableCell className="whitespace-nowrap">{penduduk.pendidikan}</TableCell>
                      <TableCell className="whitespace-nowrap">{penduduk.pekerjaan}</TableCell>
                      <TableCell className="whitespace-nowrap">RT {penduduk.rt}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(penduduk)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(penduduk.id!, penduduk.nama)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-4">
            {filteredPendudukList.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                {searchQuery ? "Tidak ada data yang sesuai dengan pencarian" : "Belum ada data penduduk"}
              </div>
            ) : (
              filteredPendudukList.map((penduduk) => (
                <div key={penduduk.id} className="bg-card border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{penduduk.nama}</h3>
                      <p className="text-sm text-muted-foreground">RT {penduduk.rt}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(penduduk)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(penduduk.id!, penduduk.nama)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">No. KK</p>
                      <p className="font-medium">{penduduk.noKK}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">NIK</p>
                      <p className="font-medium">{penduduk.nik}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Jenis Kelamin</p>
                      <p className="font-medium">{penduduk.jenisKelamin}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Umur</p>
                      <p className="font-medium">{penduduk.umur} tahun</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pendidikan</p>
                      <p className="font-medium">{penduduk.pendidikan}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pekerjaan</p>
                      <p className="font-medium">{penduduk.pekerjaan}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
