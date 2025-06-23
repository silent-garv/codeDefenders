"use client"

import { Pie, PieChart, Cell, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "Malware", value: 35, color: "#ef4444" },
  { name: "Phishing", value: 28, color: "#f97316" },
  { name: "Suspicious Activity", value: 22, color: "#eab308" },
  { name: "Network Intrusion", value: 15, color: "#3b82f6" },
]

export function AlertsChart() {
  return (
    <ChartContainer
      config={{
        malware: { label: "Malware", color: "#ef4444" },
        phishing: { label: "Phishing", color: "#f97316" },
        suspicious: { label: "Suspicious Activity", color: "#eab308" },
        intrusion: { label: "Network Intrusion", color: "#3b82f6" },
      }}
      className="h-[300px]"
    >
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend />
      </PieChart>
    </ChartContainer>
  )
}
