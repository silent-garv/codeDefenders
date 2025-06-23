"use client"

import type React from "react"

import { useAuth0 } from "@auth0/auth0-react"
import { useEffect } from "react"
import { LoginPage } from "./login-page"
import { LoadingSpinner } from "./loading-spinner"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading, error, loginWithRedirect } = useAuth0()

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !error) {
      // Auto-redirect to login if not authenticated
      // loginWithRedirect()
    }
  }, [isLoading, isAuthenticated, error, loginWithRedirect])

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Authentication Error</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return <>{children}</>
}
