"use client"

import type React from "react"

import { useAuth0 } from "@auth0/auth0-react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { LoginPage } from "./login-page"
import { LoadingSpinner } from "./loading-spinner"

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated, error, loginWithRedirect } = useAuth0()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // If user just logged in and is on a non-dashboard page, redirect to dashboard
    if (isAuthenticated && pathname === "/settings") {
      router.push("/")
    }
  }, [isAuthenticated, pathname, router])

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
            onClick={() => loginWithRedirect()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return <>{children}</>
}
