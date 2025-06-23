"use client"

import type React from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react"
import { LoadingSpinner } from "./loading-spinner"
import { LoginPage } from "./login-page"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated, error, user } = useAuth0()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      console.log("Auth State:", { isLoading, isAuthenticated, user, error })
    }
  }, [mounted, isLoading, isAuthenticated, user, error])

  // Don't render anything until mounted (prevents hydration issues)
  if (!mounted) {
    return <LoadingSpinner />
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // STRICT CHECK: Must be authenticated to proceed
  if (!isAuthenticated) {
    console.log("User not authenticated, showing login page")
    return <LoginPage />
  }

  console.log("User authenticated, rendering dashboard")
  return <>{children}</>
}
