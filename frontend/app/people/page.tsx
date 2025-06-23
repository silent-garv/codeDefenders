import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"
import { Header } from "@/components/header"
import { PeopleContent } from "@/components/people-content"

export default function PeoplePage() {
  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <PeopleContent />
        </div>
      </SidebarInset>
    </>
  )
}
