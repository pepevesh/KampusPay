'use client'

import { useState, useEffect } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { useAuth } from "@/context/AuthContext"

export function SpendingChart() {
  const [weeklyData, setWeeklyData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user, token } = useAuth()

  useEffect(() => {
    const fetchWeeklySpending = async () => {
      if (!user?.id || !token) return

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/${user.id}/daily-spending`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch weekly spending")
        }
        console.log(response);

        const data = await response.json()
        setWeeklyData(data.weeklySpending)
      } catch (error) {
        console.error("Error fetching weekly spending:", error)
        setError("Failed to fetch spending data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeeklySpending()
  }, [user?.id, token])

  if (isLoading) {
    return <div className="flex justify-center items-center h-[240px]">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center h-[240px] text-red-500">{error}</div>
  }

  return (
    <div className="pt-2">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={weeklyData}>
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
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip
            contentStyle={{ background: "#333", border: "none" }}
            itemStyle={{ color: "#fff" }}
            formatter={(value) => [`₹${value}`, "Spending"]}
          />
          <Bar
            dataKey="spending"
            fill="#7F3DFF"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

