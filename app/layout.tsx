import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

/* ✅ Font pakai VARIABLE */
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Data Penduduk Garotan",
  description: "Sistem Informasi Kependudukan Dukuh Garotan - RW 7",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="scroll-smooth antialiased">
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
