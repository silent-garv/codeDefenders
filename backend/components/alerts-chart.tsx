"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

const data = [
  { name: "Malware", value: 35, color: "#ef4444" },
  { name: "Phishing", value: 25, color: "#f97316" },
  { name: "Suspicious Activity", value: 20, color: "#eab308" },
  { name: "Network Intrusion", value: 15, color: "#3b82f6" },
  { name: "Other", value: 5, color: "#6b7280" },
]

const chartConfig = {
  alerts: {
    label: "Alerts",
  },
}

export function AlertsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alert Distribution</CardTitle>
        <CardDescription>Breakdown of alert types</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
