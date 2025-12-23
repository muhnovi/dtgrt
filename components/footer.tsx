"use client"

import { motion } from "framer-motion"

export function Footer() {
  return (
    <motion.footer
      className="bg-primary text-primary-foreground py-4 sm:py-6 px-4 mt-8 sm:mt-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-sm sm:text-base font-medium">Dukuh Garotan @Duta Bangsa Surakarta</p>
        <p className="text-xs sm:text-sm text-primary-foreground/70 mt-2">
          © {new Date().getFullYear()} Sistem Informasi Kependudukan Dukuh
        </p>
      </div>
    </motion.footer>
  )
}
