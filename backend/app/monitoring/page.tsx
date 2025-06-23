"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { MonitoringContent } from "@/components/monitoring-content"

export default function MonitoringPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <MonitoringContent />
      </DashboardLayout>
    </AuthGuard>
  )
}
