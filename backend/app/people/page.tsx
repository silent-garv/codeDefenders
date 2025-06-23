"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PeopleContent } from "@/components/people-content"

export default function PeoplePage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <PeopleContent />
      </DashboardLayout>
    </AuthGuard>
  )
}
