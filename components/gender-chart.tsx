"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface GenderChartProps {
  lakiLaki: number
  perempuan: number
}

export function GenderChart({ lakiLaki, perempuan }: GenderChartProps) {
  const data = [
    { name: "Laki-laki", value: lakiLaki, color: "#10b981" },
    { name: "Perempuan", value: perempuan, color: "#3b82f6" },
  ]

  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Demografi Jenis Kelamin</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>
    </motion.div>
  )
}
