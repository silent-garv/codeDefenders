"use client"

import { useAuth0 } from "@auth0/auth0-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Github, Mail, AlertCircle } from "lucide-react"
import { useState } from "react"

export function LoginPage() {
  const { loginWithRedirect, isLoading } = useAuth0()
  const [loginError, setLoginError] = useState<string | null>(null)

  const handleLogin = async (connection?: string) => {
    try {
      setLoginError(null)
      console.log("Attempting login with connection:", connection)

      await loginWithRedirect({
        authorizationParams: {
          connection: connection,
          prompt: "login",
          scope: "openid profile email",
        },
      })
    } catch (error) {
      console.error("Login error:", error)
      setLoginError("Failed to initiate login. Please try again.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Card className="w-full max-w-md mx-4 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CyberSentinel
          </CardTitle>
          <CardDescription className="text-gray-600">
            Authentication required to access the security dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loginError && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{loginError}</span>
            </div>
          )}

          <Button
            onClick={() => handleLogin("google-oauth2")}
            disabled={isLoading}
            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm"
            variant="outline"
          >
            <Mail className="w-5 h-5 mr-3" />
            {isLoading ? "Signing in..." : "Continue with Google"}
          </Button>

          <Button
            onClick={() => handleLogin("github")}
            disabled={isLoading}
            className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Github className="w-5 h-5 mr-3" />
            {isLoading ? "Signing in..." : "Continue with GitHub"}
          </Button>

          <Button
            onClick={() => handleLogin()}
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            {isLoading ? "Signing in..." : "Sign in with Auth0"}
          </Button>

          <div className="text-center text-sm text-gray-500 mt-6">🔒 Secured by Auth0 Authentication</div>
        </CardContent>
      </Card>
    </div>
  )
}
