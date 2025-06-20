import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter"
import { StrictMode } from "react"
import { DatePickerProvider } from "@/components/DatePickerProvider"
import { ThemeProvider } from "@/contexts/ThemeContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Form Builder",
  description: "Create and manage forms easily",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StrictMode>
          <AppRouterCacheProvider>
            <ThemeProvider>
              <DatePickerProvider>{children}</DatePickerProvider>
            </ThemeProvider>
          </AppRouterCacheProvider>
        </StrictMode>
      </body>
    </html>
  )
}
