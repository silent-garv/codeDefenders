"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { date: "Jan", score: 75 },
  { date: "Feb", score: 78 },
  { date: "Mar", score: 82 },
  { date: "Apr", score: 85 },
  { date: "May", score: 87 },
  { date: "Jun", score: 89 },
  { date: "Jul", score: 87 },
]

const chartConfig = {
  score: {
    label: "Security Score",
    color: "hsl(var(--chart-2))",
  },
}

export function SecurityScoreChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Score Trend</CardTitle>
        <CardDescription>Security posture over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--chart-2))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
