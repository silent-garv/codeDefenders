"use client"

import { createContext, useContext, useEffect, useState } from "react"
import io from "socket.io-client"

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider")
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [alerts, setAlerts] = useState([])
  const [people, setPeople] = useState([])
  const [metrics, setMetrics] = useState({
    totalAlerts: 0,
    criticalAlerts: 0,
    highRiskUsers: 0,
    threatCategories: {},
    alertTrends: [],
  })

  useEffect(() => {
    const newSocket = io("http://localhost:5000")
    setSocket(newSocket)

    newSocket.on("connect", () => {
      console.log("Connected to server")
      setIsConnected(true)
    })

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server")
      setIsConnected(false)
    })

    newSocket.on("initial-data", (data) => {
      console.log("Received initial data:", data)
      if (data.alerts) setAlerts(data.alerts)
      if (data.people) setPeople(data.people)
      if (data.metrics) setMetrics(data.metrics)
    })

    newSocket.on("new-alert", (alert) => {
      console.log("New alert received:", alert)
      setAlerts((prev) => [alert, ...prev].slice(0, 100)) // Keep last 100 alerts
    })

    newSocket.on("people-update", (updatedPeople) => {
      setPeople(updatedPeople)
    })

    newSocket.on("metrics-update", (updatedMetrics) => {
      setMetrics(updatedMetrics)
    })

    return () => {
      newSocket.close()
    }
  }, [])

  const value = {
    socket,
    isConnected,
    alerts,
    people,
    metrics,
    setAlerts,
    setPeople,
    setMetrics,
  }

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
}
