import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import "./globals.css"
import { Toaster } from "sonner"
 import { cn } from "@/lib/utils"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ConstructEye",
  description: "Plataforma de Gerenciamento de Construção",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
       <html lang="pt-BR">
        <body className={cn("h-screen", inter.className)}>
          {children}
          <Toaster richColors closeButton position="top-right" />
        </body>
      </html>
   )
}

