"use client"

import { useAuth0 } from "@auth0/auth0-react"
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"

export function LoginButton() {
  const { loginWithRedirect, isLoading } = useAuth0()

  return (
    <Button onClick={() => loginWithRedirect()} disabled={isLoading} className="w-full">
      <LogIn className="mr-2 h-4 w-4" />
      {isLoading ? "Loading..." : "Log In"}
    </Button>
  )
}
