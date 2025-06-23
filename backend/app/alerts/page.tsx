"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { AlertsContent } from "@/components/alerts-content"

export default function AlertsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <AlertsContent />
      </DashboardLayout>
    </AuthGuard>
  )
}
