"use client"

import { useEffect, useState } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { DashboardContent } from "@/components/dashboard-content"

type Alert = {
  message: string
  timestamp?: string
}

export default function HomePage() {
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) {
      console.error("NEXT_PUBLIC_API_URL is not defined")
      return
    }

    const evtSource = new EventSource(`${apiUrl}/events`)

    evtSource.onmessage = (event) => {
      const alert: Alert = JSON.parse(event.data)
      setAlerts((prev) => [...prev, alert])

      if (Notification.permission === "granted") {
        new Notification("🚨 CyberSentinel Alert", {
          body: alert.message
        })
      } else {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification("🚨 CyberSentinel Alert", {
              body: alert.message
            })
          }
        })
      }
    }

    evtSource.onerror = (err) => {
      console.error("SSE error:", err)
      evtSource.close()
    }

    return () => {
      evtSource.close()
    }
  }, [])

  return (
    <AuthGuard>
      <DashboardLayout>
        <DashboardContent />
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2">🔔 Live Alerts</h2>
          <ul className="space-y-2">
            {alerts.map((alert, i) => (
              <li key={i} className="bg-red-100 p-2 rounded shadow">
                {alert.message}
              </li>
            ))}
          </ul>
        </div>
      </DashboardLayout>
    </AuthGuard>
  )
}
