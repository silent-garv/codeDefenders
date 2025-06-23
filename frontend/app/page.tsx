"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardContent } from "@/components/dashboard-content"

export default function HomePage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </AuthGuard>
  )
}
