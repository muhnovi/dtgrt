"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"

interface StatCardProps {
  title: string
  value: number | string
  icon?: React.ReactNode
  delay?: number
}

export function StatCard({ title, value, icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}>
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <motion.p
              className="text-3xl font-bold text-foreground"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: delay + 0.2 }}
            >
              {value}
            </motion.p>
          </div>
          {icon && (
            <motion.div
              className="text-primary"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.1 }}
            >
              {icon}
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
