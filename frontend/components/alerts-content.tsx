"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Shield, Clock, User, Filter, Search } from "lucide-react"

const alerts = [
  {
    id: 1,
    type: "Critical",
    title: "Malware Detected",
    description: "Suspicious executable file detected in user downloads",
    user: "john.doe@company.com",
    timestamp: "2024-01-15 14:30:22",
    status: "Active",
    severity: "high",
  },
  {
    id: 2,
    type: "Warning",
    title: "Unusual Login Pattern",
    description: "Multiple failed login attempts from unknown IP address",
    user: "jane.smith@company.com",
    timestamp: "2024-01-15 14:25:15",
    status: "Investigating",
    severity: "medium",
  },
  {
    id: 3,
    type: "Info",
    title: "Security Scan Complete",
    description: "Scheduled security scan completed successfully",
    user: "system",
    timestamp: "2024-01-15 14:00:00",
    status: "Resolved",
    severity: "low",
  },
  {
    id: 4,
    type: "Critical",
    title: "Data Exfiltration Attempt",
    description: "Unusual data transfer patterns detected",
    user: "mike.wilson@company.com",
    timestamp: "2024-01-15 13:45:33",
    status: "Active",
    severity: "high",
  },
  {
    id: 5,
    type: "Warning",
    title: "Phishing Email Detected",
    description: "Suspicious email with malicious links intercepted",
    user: "sarah.johnson@company.com",
    timestamp: "2024-01-15 13:20:18",
    status: "Blocked",
    severity: "medium",
  },
]

export function AlertsContent() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Alerts</h1>
          <p className="text-muted-foreground">Monitor and manage security incidents</p>
        </div>
        <Button>
          <AlertTriangle className="mr-2 h-4 w-4" />
          Create Alert
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search alerts..." className="pl-8" />
            </div>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="high">Critical</SelectItem>
                <SelectItem value="medium">Warning</SelectItem>
                <SelectItem value="low">Info</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert) => (
          <Card key={alert.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div
                    className={`p-2 rounded-full ${
                      alert.severity === "high"
                        ? "bg-red-100 dark:bg-red-900/20"
                        : alert.severity === "medium"
                          ? "bg-yellow-100 dark:bg-yellow-900/20"
                          : "bg-blue-100 dark:bg-blue-900/20"
                    }`}
                  >
                    {alert.severity === "high" ? (
                      <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    ) : alert.severity === "medium" ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    ) : (
                      <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{alert.title}</h3>
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
                      <Badge
                        variant="outline"
                        className={
                          alert.status === "Active"
                            ? "border-red-500 text-red-600"
                            : alert.status === "Investigating"
                              ? "border-yellow-500 text-yellow-600"
                              : alert.status === "Resolved"
                                ? "border-green-500 text-green-600"
                                : "border-blue-500 text-blue-600"
                        }
                      >
                        {alert.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{alert.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {alert.user}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {alert.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Investigate
                  </Button>
                  <Button variant="outline" size="sm">
                    Resolve
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
