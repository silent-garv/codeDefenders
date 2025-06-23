"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThreatChart } from "@/components/threat-chart"
import { AlertsChart } from "@/components/alerts-chart"
import { SecurityScoreChart } from "@/components/security-score-chart"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Shield, Users, Activity, TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"

export function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/alerts">
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-red-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">23</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-red-500" />
                +12% from last hour
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/monitoring">
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Score</CardTitle>
              <Shield className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">87%</div>
              <Progress value={87} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">Excellent security posture</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/people">
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1,247</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                +5.2% from yesterday
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/monitoring">
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Threat Level</CardTitle>
              <Activity className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">Medium</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-green-500" />
                Decreased from High
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Threat Detection Timeline</CardTitle>
            <CardDescription>Real-time threat detection over the last 24 hours</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <ThreatChart />
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Alert Distribution</CardTitle>
            <CardDescription>Breakdown of alert types</CardDescription>
          </CardHeader>
          <CardContent>
            <AlertsChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Security Score Trend</CardTitle>
            <CardDescription>Security posture over time</CardDescription>
          </CardHeader>
          <CardContent>
            <SecurityScoreChart />
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Latest security alerts and incidents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  type: "Critical",
                  message: "Suspicious login attempt detected",
                  time: "2 minutes ago",
                  severity: "high",
                },
                {
                  type: "Warning",
                  message: "Unusual network traffic pattern",
                  time: "15 minutes ago",
                  severity: "medium",
                },
                { type: "Info", message: "Security scan completed successfully", time: "1 hour ago", severity: "low" },
                { type: "Critical", message: "Malware signature detected", time: "2 hours ago", severity: "high" },
              ].map((alert, index) => (
                <Link key={index} href="/alerts">
                  <div className="flex items-center space-x-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        alert.severity === "high"
                          ? "bg-red-500"
                          : alert.severity === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            alert.severity === "high"
                              ? "destructive"
                              : alert.severity === "medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {alert.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{alert.time}</span>
                      </div>
                      <p className="text-sm">{alert.message}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
