'use client'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { name: "Sun", income: 40, spending: 65 },
  { name: "Mon", income: 30, spending: 45 },
  { name: "Tue", income: 25, spending: 55 },
  { name: "Wed", income: 35, spending: 60 },
  { name: "Thu", income: 20, spending: 70 },
  { name: "Fri", income: 15, spending: 75 },
  { name: "Today", income: 45, spending: 0 },
]

export function SpendingChart() {
  return (
    <div className="pt-2">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Bar
            dataKey="income"
            fill="#4ade80"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="spending"
            fill="#f43f5e"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

