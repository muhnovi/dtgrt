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
      <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold text-primary">RT {rt}</h3>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                <span className="text-xs sm:text-sm text-muted-foreground">Penduduk</span>
              </div>
              <span className="text-base sm:text-lg font-semibold text-foreground">{jumlahPenduduk}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Home className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                <span className="text-xs sm:text-sm text-muted-foreground">Kepala Keluarga</span>
              </div>
              <span className="text-base sm:text-lg font-semibold text-foreground">{jumlahKK}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
