"use client"

import { useAuth0 } from "@auth0/auth0-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Mail, Facebook } from "lucide-react"

export function LoginPage() {
  const { loginWithRedirect } = useAuth0()

  const handleLogin = (connection?: string) => {
    loginWithRedirect({
      authorizationParams: {
        connection: connection,
      },
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">CS</span>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CyberSentinel
          </CardTitle>
          <CardDescription className="text-lg">Advanced Security Monitoring Platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-6">
              Sign in to access your security dashboard and monitor threats in real-time
            </p>
          </div>

          <Button className="w-full h-12 text-base" onClick={() => handleLogin()} size="lg">
            Sign In with Auth0
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Button variant="outline" className="h-12" onClick={() => handleLogin("google-oauth2")}>
              <Mail className="mr-2 h-5 w-5" />
              Continue with Google
            </Button>
            <Button variant="outline" className="h-12" onClick={() => handleLogin("github")}>
              <Github className="mr-2 h-5 w-5" />
              Continue with GitHub
            </Button>
            <Button variant="outline" className="h-12" onClick={() => handleLogin("facebook")}>
              <Facebook className="mr-2 h-5 w-5" />
              Continue with Facebook
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
