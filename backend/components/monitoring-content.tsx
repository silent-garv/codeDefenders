"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Activity, Server, Wifi, Database, Cpu, HardDrive, TrendingUp, TrendingDown } from "lucide-react"
import { SystemMetricsChart } from "@/components/system-metrics-chart"
import { NetworkTrafficChart } from "@/components/network-traffic-chart"

const systemMetrics = [
  { name: "Web Server", status: "Healthy", uptime: "99.9%", cpu: 45, memory: 62, disk: 78 },
  { name: "Database Server", status: "Warning", uptime: "98.2%", cpu: 78, memory: 85, disk: 45 },
  { name: "API Gateway", status: "Healthy", uptime: "99.8%", cpu: 32, memory: 48, disk: 23 },
  { name: "Load Balancer", status: "Healthy", uptime: "100%", cpu: 15, memory: 28, disk: 12 },
]

export function MonitoringContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Monitoring</h1>
          <p className="text-muted-foreground">Real-time system health and performance metrics</p>
        </div>
      </div>

      {/* System Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">99.8%</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +0.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Traffic</CardTitle>
            <Wifi className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2.4 GB/s</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              +15% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <Server className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">8,247</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-red-500" />
              -3% from last hour
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Queries</CardTitle>
            <Database className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">1.2M</div>
            <p className="text-xs text-muted-foreground">Per hour average</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>CPU, Memory, and Disk usage over time</CardDescription>
          </CardHeader>
          <CardContent>
            <SystemMetricsChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network Traffic</CardTitle>
            <CardDescription>Inbound and outbound traffic patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <NetworkTrafficChart />
          </CardContent>
        </Card>
      </div>

      {/* Server Status */}
      <Card>
        <CardHeader>
          <CardTitle>Server Status</CardTitle>
          <CardDescription>Real-time status of all system components</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {systemMetrics.map((server, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        server.status === "Healthy"
                          ? "bg-green-500"
                          : server.status === "Warning"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                      }`}
                    />
                    <h3 className="font-semibold">{server.name}</h3>
                    <Badge
                      variant={
                        server.status === "Healthy"
                          ? "default"
                          : server.status === "Warning"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {server.status}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">Uptime: {server.uptime}</span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Cpu className="h-3 w-3" />
                        CPU
                      </span>
                      <span>{server.cpu}%</span>
                    </div>
                    <Progress value={server.cpu} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        Memory
                      </span>
                      <span>{server.memory}%</span>
                    </div>
                    <Progress value={server.memory} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1">
                        <HardDrive className="h-3 w-3" />
                        Disk
                      </span>
                      <span>{server.disk}%</span>
                    </div>
                    <Progress value={server.disk} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
