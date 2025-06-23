import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Auth0Provider } from "@/components/auth/auth0-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CyberSentinel Dashboard",
  description: "Advanced cybersecurity monitoring and threat detection platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Auth0Provider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </Auth0Provider>
      </body>
    </html>
  )
}
