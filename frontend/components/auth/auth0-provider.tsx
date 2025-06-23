"use client"

import type React from "react"

import { Auth0Provider as Auth0ProviderBase } from "@auth0/auth0-react"

export function Auth0Provider({ children }: { children: React.ReactNode }) {
  const domain = process.env.NEXT_PUBLIC_AUTH0_DOMAIN
  const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID

  if (!domain || !clientId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Error</h1>
          <p className="text-gray-600">
            Please configure your Auth0 environment variables:
            <br />
            NEXT_PUBLIC_AUTH0_DOMAIN
            <br />
            NEXT_PUBLIC_AUTH0_CLIENT_ID
          </p>
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
      }}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0ProviderBase>
  )
}
