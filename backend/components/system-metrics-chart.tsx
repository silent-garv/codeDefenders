"use client"

import { Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { time: "00:00", cpu: 45, memory: 62, disk: 78 },
  { time: "04:00", cpu: 52, memory: 58, disk: 79 },
  { time: "08:00", cpu: 68, memory: 72, disk: 80 },
  { time: "12:00", cpu: 75, memory: 85, disk: 82 },
  { time: "16:00", cpu: 62, memory: 68, disk: 81 },
  { time: "20:00", cpu: 48, memory: 55, disk: 83 },
  { time: "24:00", cpu: 42, memory: 48, disk: 84 },
]

export function SystemMetricsChart() {
  return (
    <ChartContainer
      config={{
        cpu: {
          label: "CPU Usage",
          color: "hsl(var(--chart-1))",
        },
        memory: {
          label: "Memory Usage",
          color: "hsl(var(--chart-2))",
        },
        disk: {
          label: "Disk Usage",
          color: "hsl(var(--chart-3))",
        },
      }}
      className="h-[300px]"
    >
      <LineChart data={data}>
        <XAxis dataKey="time" />
        <YAxis domain={[0, 100]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          type="monotone"
          dataKey="cpu"
          stroke="var(--color-cpu)"
          strokeWidth={2}
          dot={{ fill: "var(--color-cpu)", strokeWidth: 2, r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="memory"
          stroke="var(--color-memory)"
          strokeWidth={2}
          dot={{ fill: "var(--color-memory)", strokeWidth: 2, r: 3 }}
        />
        <Line
          type="monotone"
          dataKey="disk"
          stroke="var(--color-disk)"
          strokeWidth={2}
          dot={{ fill: "var(--color-disk)", strokeWidth: 2, r: 3 }}
        />
      </LineChart>
    </ChartContainer>
  )
}
