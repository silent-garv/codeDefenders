"use client"

import { Auth0Provider } from "@auth0/auth0-react"
import type { ReactNode } from "react"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN!
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID!
  const redirectUri = typeof window !== "undefined" ? window.location.origin : ""

  if (!domain || !clientId) {
    console.error("Auth0 configuration missing. Please check your environment variables.")
    return <>{children}</>
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
        scope: "openid profile email",
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  )
}
