import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

/* Font */
const geist = Geist({
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
})

/* ✅ Metadata (TANPA viewport) */
export const metadata: Metadata = {
  title: "Data Penduduk Garotan",
  description: "Sistem Informasi Kependudukan Dukuh Garotan - RW 7",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

/* ✅ Viewport HARUS export terpisah */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${geist.className} ${geistMono.className} antialiased`}
      >
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
