import { AuthGuard } from "@/components/auth/auth-guard"

export default function Home() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  )
}
