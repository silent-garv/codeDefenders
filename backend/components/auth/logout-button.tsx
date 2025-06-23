"use client"

import { useAuth0 } from "@auth0/auth0-react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const { logout, isLoading } = useAuth0()

  return (
    <Button
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      disabled={isLoading}
      variant="outline"
      size="sm"
    >
      <LogOut className="mr-2 h-4 w-4" />
      {isLoading ? "Loading..." : "Log Out"}
    </Button>
  )
}
