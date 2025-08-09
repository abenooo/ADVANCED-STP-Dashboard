import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import ErrorBoundary from "@/components/ErrorBoundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Service Provider Advanced Technology Solutions Dashboard",
  description: "A comprehensive dashboard for managing service provider operations.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
  auth, // This is the parallel route slot
}: Readonly<{
  children: React.ReactNode
  auth: React.ReactNode // Define the type for the auth slot
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ErrorBoundary>
          <ThemeProvider>
            {children}
            {auth} {/* Render the parallel route slot */}
            <Toaster />
          </ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
