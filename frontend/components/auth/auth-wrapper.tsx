"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { SimpleAuth } from "./simple-auth"

interface AuthWrapperProps {
  children: React.ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const authStatus = localStorage.getItem("cybersentinel-auth")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleLogin = () => {
    localStorage.setItem("cybersentinel-auth", "true")
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("cybersentinel-auth")
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <SimpleAuth onLogin={handleLogin} />
  }

  return <>{children}</>
}
