"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Users, Home } from "lucide-react"

interface RTCardProps {
  rt: string
  jumlahPenduduk: number
  jumlahKK: number
  delay?: number
}

export function RTCard({ rt, jumlahPenduduk, jumlahKK, delay = 0 }: RTCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.05 }}
    >
      <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-primary">RT {rt}</h3>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Penduduk</span>
              </div>
              <span className="text-lg font-semibold text-foreground">{jumlahPenduduk}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Kepala Keluarga</span>
              </div>
              <span className="text-lg font-semibold text-foreground">{jumlahKK}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
