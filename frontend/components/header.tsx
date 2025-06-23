"use client"

import Link from "next/link"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Bell, Search, User } from "lucide-react"
import { Input } from "@/components/ui/input"

function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      {/* left section */}
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search alerts, users, or events..." className="pl-8 w-64" />
        </div>
      </div>

      {/* right section */}
      <div className="ml-auto flex items-center gap-2 px-4">
        {/* notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                3
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-56 p-0">
            <div className="p-3 text-sm font-semibold border-b">Recent Alerts</div>
            <ul className="max-h-56 overflow-y-auto text-sm">
              {/* Replace with real-time data */}
              <li className="p-3 hover:bg-muted/50 cursor-pointer">🚨 High-severity intrusion detected</li>
              <li className="p-3 hover:bg-muted/50 cursor-pointer">⚠️ Suspicious login attempt</li>
              <li className="p-3 hover:bg-muted/50 cursor-pointer">🛡️ Malware blocked</li>
            </ul>
            <Link href="/alerts" className="block text-center text-xs py-2 border-t hover:bg-muted/50">
              View all alerts →
            </Link>
          </PopoverContent>
        </Popover>

        <ThemeToggle />

        {/* settings link */}
        <Link href="/settings" passHref legacyBehavior>
          <Button variant="ghost" size="icon" asChild>
            <User className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </header>
  )
}

export { Header }
export default Header
