import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { Header } from "@/components/header"
import { AlertsContent } from "@/components/alerts-content"

export default function AlertsPage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <AlertsContent />
        </div>
      </SidebarInset>
    </>
  )
}
