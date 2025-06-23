"use client"

import { useAuth0 } from "@auth0/auth0-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Github, Chrome, Facebook } from "lucide-react"

export function LoginPage() {
  const { loginWithRedirect, isLoading } = useAuth0()

  const handleLogin = (connection?: string) => {
    loginWithRedirect({
      authorizationParams: {
        connection,
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">CyberSentinel</CardTitle>
          <CardDescription>Secure your digital world with advanced threat monitoring</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => handleLogin()} disabled={isLoading} className="w-full" size="lg">
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" onClick={() => handleLogin("google-oauth2")} disabled={isLoading}>
              <Chrome className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => handleLogin("github")} disabled={isLoading}>
              <Github className="h-4 w-4" />
            </Button>
            <Button variant="outline" onClick={() => handleLogin("facebook")} disabled={isLoading}>
              <Facebook className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
