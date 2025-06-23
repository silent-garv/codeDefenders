"use client"

import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const pathname = usePathname()

  const getPageTitle = () => {
    switch (pathname) {
      case "/":
        return "Dashboard"
      case "/alerts":
        return "Alerts"
      case "/people":
        return "People"
      case "/monitoring":
        return "Monitoring"
      case "/settings":
        return "Settings"
      default:
        return "Dashboard"
    }
  }

  const notifications = [
    { id: 1, title: "Critical Alert", message: "Malware detected on system", time: "2 min ago", severity: "high" },
    { id: 2, title: "Warning", message: "Unusual network activity", time: "5 min ago", severity: "medium" },
    { id: 3, title: "Info", message: "Security scan completed", time: "10 min ago", severity: "low" },
  ]

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/">CyberSentinel</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{getPageTitle()}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="ml-auto flex items-center gap-2 px-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <h4 className="font-medium leading-none">Notifications</h4>
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-start space-x-2 p-2 rounded-lg hover:bg-muted/50">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        notification.severity === "high"
                          ? "bg-red-500"
                          : notification.severity === "medium"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                      }`}
                    />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="end">
            <div className="space-y-2">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">john@example.com</p>
              </div>
              <div className="border-t pt-2">
                <Link href="/settings" className="block px-2 py-1.5 text-sm hover:bg-muted rounded">
                  Settings
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("cybersentinel-auth")
                    window.location.reload()
                  }}
                  className="w-full text-left px-2 py-1.5 text-sm hover:bg-muted rounded"
                >
                  Logout
                </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <ThemeToggle />
      </div>
    </header>
  )
}
