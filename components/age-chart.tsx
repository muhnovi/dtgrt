"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface AgeChartProps {
  data: Array<{ kategori: string; jumlah: number }>
}

export function AgeChart({ data }: AgeChartProps) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
      <Card className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-foreground">Demografi Kategori Umur</h3>
        <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="kategori" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: "14px" }} />
            <Bar dataKey="jumlah" fill="#10b981" name="Jumlah Penduduk" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  )
}
