"use client"

import type React from "react"
import { Auth0Provider as Auth0ProviderBase } from "@auth0/auth0-react"

export function Auth0Provider({ children }: { children: React.ReactNode }) {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID

  if (!domain || !clientId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Required</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Auth0 environment variables are missing. Please configure:
          </p>
          <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-sm font-mono">
            <div>NEXT_PUBLIC_AUTH0_DOMAIN</div>
            <div>NEXT_PUBLIC_AUTH0_CLIENT_ID</div>
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
    >
      {children}
    </Auth0ProviderBase>
  )
}
