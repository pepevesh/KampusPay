'use client'
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"

const data = [
  { name: "Canteen", value: 300, color: "#4ade80" },
  { name: "Stationery", value: 150, color: "#a78bfa" },
  { name: "Events", value: 200, color: "#fbbf24" },
  { name: "Others", value: 108, color: "#f43f5e" },
]

export function SpendingDonut() {
  return (
    <div className="relative h-[240px] ">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold">$758</div>
          <div className="text-xs text-muted-foreground">Total Spent</div>
        </div>
      </div>
    </div>
  )
}

