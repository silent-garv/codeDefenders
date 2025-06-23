"use client"

import { Area, AreaChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { time: "00:00", threats: 12, blocked: 8 },
  { time: "04:00", threats: 19, blocked: 15 },
  { time: "08:00", threats: 35, blocked: 28 },
  { time: "12:00", threats: 42, blocked: 35 },
  { time: "16:00", threats: 28, blocked: 22 },
  { time: "20:00", threats: 31, blocked: 25 },
  { time: "24:00", threats: 23, blocked: 18 },
]

export function ThreatChart() {
  return (
    <ChartContainer
      config={{
        threats: {
          label: "Threats Detected",
          color: "hsl(var(--chart-1))",
        },
        blocked: {
          label: "Threats Blocked",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <AreaChart data={data}>
        <defs>
          <linearGradient id="fillThreats" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-threats)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-threats)" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="fillBlocked" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-blocked)" stopOpacity={0.8} />
            <stop offset="95%" stopColor="var(--color-blocked)" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <XAxis dataKey="time" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area type="monotone" dataKey="blocked" stackId="1" stroke="var(--color-blocked)" fill="url(#fillBlocked)" />
        <Area type="monotone" dataKey="threats" stackId="1" stroke="var(--color-threats)" fill="url(#fillThreats)" />
      </AreaChart>
    </ChartContainer>
  )
}
