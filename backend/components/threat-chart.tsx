"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { time: "00:00", threats: 12 },
  { time: "04:00", threats: 8 },
  { time: "08:00", threats: 23 },
  { time: "12:00", threats: 45 },
  { time: "16:00", threats: 32 },
  { time: "20:00", threats: 18 },
  { time: "24:00", threats: 15 },
]

const chartConfig = {
  threats: {
    label: "Threats",
    color: "hsl(var(--chart-1))",
  },
}

export function ThreatChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Threat Detection Timeline</CardTitle>
        <CardDescription>Real-time threat detection over the last 24 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <XAxis dataKey="time" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="threats"
                stroke="hsl(var(--chart-1))"
                fill="hsl(var(--chart-1))"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
