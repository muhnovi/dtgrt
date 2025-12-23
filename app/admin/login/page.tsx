"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useRouter } from "next/navigation"
import { ArrowLeft, LogIn } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminLoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast({
        title: "Login berhasil!",
        description: "Selamat datang di panel admin",
      })
      router.push("/admin/dashboard")
    } catch (error: any) {
      toast({
        title: "Login gagal",
        description: error.message || "Email atau password salah",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="p-8">
          <div className="space-y-6">
            <div className="text-center">
              <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                <h1 className="text-3xl font-bold text-foreground">Login Admin</h1>
                <p className="text-muted-foreground mt-2">Masuk ke panel administrasi data penduduk</p>
              </motion.div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@desa.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </motion.div>

              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <Button type="submit" className="w-full gap-2" disabled={loading}>
                  <LogIn className="w-4 h-4" />
                  {loading ? "Memproses..." : "Login"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2 bg-transparent"
                  onClick={() => router.push("/")}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Beranda
                </Button>
              </motion.div>
            </form>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
