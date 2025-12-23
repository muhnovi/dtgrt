"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from "recharts"
import type { DemografiPekerjaan } from "@/lib/types"

interface OccupationChartProps {
  data: DemografiPekerjaan[]
}

const COLORS = [
  "#10b981", // green
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f97316", // orange
]

export function OccupationChart({ data }: OccupationChartProps) {
  const sortedData = [...data]
    .sort((a, b) => b.jumlah - a.jumlah)
    .slice(0, 8)
    .map((item) => ({
      ...item,
      pekerjaanShort: item.pekerjaan.length > 15 ? item.pekerjaan.substring(0, 15) + "..." : item.pekerjaan,
      pekerjaan: item.pekerjaan.length > 20 ? item.pekerjaan.substring(0, 20) + "..." : item.pekerjaan,
    }))

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg text-foreground">Demografi Berdasarkan Pekerjaan</CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">Top 8 pekerjaan dengan jumlah terbanyak</p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="block sm:hidden">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={sortedData} layout="vertical" margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                <YAxis
                  type="category"
                  dataKey="pekerjaanShort"
                  stroke="hsl(var(--muted-foreground))"
                  width={100}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(value: number) => [`${value} orang`, "Jumlah"]}
                />
                <Bar dataKey="jumlah" radius={[0, 8, 8, 0]}>
                  <LabelList dataKey="jumlah" position="right" fill="hsl(var(--foreground))" fontSize={10} />
                  {sortedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="hidden sm:block">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={sortedData} layout="vertical" margin={{ left: 20, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis
                  type="category"
                  dataKey="pekerjaan"
                  stroke="hsl(var(--muted-foreground))"
                  width={150}
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value} orang`, "Jumlah"]}
                />
                <Bar dataKey="jumlah" radius={[0, 8, 8, 0]}>
                  <LabelList dataKey="jumlah" position="right" fill="hsl(var(--foreground))" fontSize={12} />
                  {sortedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
  