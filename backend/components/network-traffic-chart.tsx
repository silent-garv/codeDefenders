"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { time: "00:00", inbound: 1.2, outbound: 0.8 },
  { time: "04:00", inbound: 0.9, outbound: 0.6 },
  { time: "08:00", inbound: 2.1, outbound: 1.4 },
  { time: "12:00", inbound: 2.8, outbound: 1.9 },
  { time: "16:00", inbound: 2.4, outbound: 1.6 },
  { time: "20:00", inbound: 1.8, outbound: 1.2 },
  { time: "24:00", inbound: 1.5, outbound: 1.0 },
]

export function NetworkTrafficChart() {
  return (
    <ChartContainer
      config={{
        inbound: {
          label: "Inbound Traffic (GB/s)",
          color: "hsl(var(--chart-1))",
        },
        outbound: {
          label: "Outbound Traffic (GB/s)",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[300px]"
    >
      <BarChart data={data}>
        <XAxis dataKey="time" />
        <YAxis />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="inbound" fill="var(--color-inbound)" radius={[2, 2, 0, 0]} />
        <Bar dataKey="outbound" fill="var(--color-outbound)" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
