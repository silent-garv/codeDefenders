import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthWrapper } from "@/components/auth/auth-wrapper"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import { SidebarInset } from "@/components/ui/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CyberSentinel - Security Dashboard",
  description: "Advanced cybersecurity monitoring and alert management platform",
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthWrapper>
            <SidebarProvider defaultOpen={true}>
              <AppSidebar />
              <SidebarInset>
                <Header />
                <main className="flex-1 p-6">{children}</main>
              </SidebarInset>
            </SidebarProvider>
          </AuthWrapper>
        </ThemeProvider>
      </body>
    </html>
  )
}
