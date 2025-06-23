import type React from "react"
import type { Metadata } from "next"
import { Lato, Quicksand, Great_Vibes } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
// Importar el componente AdminAccess
import { AdminAccess } from "@/app/components/admin-access"

const lato = Lato({
  weight: ["400", "700", "900"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lato",
})

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-quicksand",
})

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-great-vibes",
})

export const metadata: Metadata = {
  title: "Glow Up - Estética Cosmiátrica",
  description: "Estudio cosmiátrico especializado en tratamientos personalizados para realzar tu belleza natural.",
    generator: 'v0.dev'
}

// Modificar el componente RootLayout para incluir AdminAccess
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${lato.className} ${lato.variable} ${quicksand.variable} ${greatVibes.variable}`}>
        {children}
        <Toaster />
        <AdminAccess />
      </body>
    </html>
  )
}
