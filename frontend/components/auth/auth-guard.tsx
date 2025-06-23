"use client"

import type React from "react"

import { useAuth0 } from "@auth0/auth0-react"
import { LoadingSpinner } from "./loading-spinner"
import { LoginPage } from "./login-page"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated, error } = useAuth0()

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
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
