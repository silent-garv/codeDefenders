"use client"

import type React from "react"
import { Auth0Provider as Auth0ProviderBase } from "@auth0/auth0-react"

export function Auth0Provider({ children }: { children: React.ReactNode }) {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN || "dev-4bvocl4ni1zr3kaa.us.auth0.com"
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID || "g3C92QQQm2xVfQqkTQUIbaX1znyadkbw"

  if (!domain || !clientId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Auth0 Configuration Missing</h1>
          <p className="text-gray-600 mb-4">Required environment variables:</p>
          <div className="bg-gray-100 p-3 rounded text-sm font-mono text-left">
            <div>NEXT_PUBLIC_AUTH0_DOMAIN: {domain || "❌ Missing"}</div>
            <div>NEXT_PUBLIC_AUTH0_CLIENT_ID: {clientId || "❌ Missing"}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Auth0ProviderBase
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: typeof window !== "undefined" ? window.location.origin : "",
        scope: "openid profile email",
      }}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      onRedirectCallback={(appState) => {
        // Always redirect to dashboard after login, not to the returnTo URL
        if (typeof window !== "undefined") {
          window.location.href = "/"
        }
      }}
    >
      {children}
    </Auth0ProviderBase>
  )
}
