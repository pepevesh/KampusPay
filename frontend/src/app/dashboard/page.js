'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCard } from "@/components/stats-card"
import { SpendingChart } from "@/components/spending-chart"
import { SpendingDonut } from "@/components/spending-donut"
import { useAuth } from "@/context/AuthContext"

export default function Dashboard() {
  const { user, token } = useAuth();
  const [dailySpending, setDailySpending] = useState(0);

  useEffect(() => {
    // Fetch the daily spending data
    const fetchDailySpending = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/${user?.id}/daily-spending`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch daily spending");
        }

        const data = await response.json();
        setDailySpending(data.totalSpent);
      } catch (error) {
        console.error("Error fetching daily spending:", error);
      }
    };

    if (user?.userId) {
      fetchDailySpending();
    }
  }, [user, token]);

  return (
    <div className="flex min-h-screen bg-gray-900 mb-16">
      <div className="w-full max-w-5xl mx-auto space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <StatsCard
            title="Total Balance"
            value={user?.balance}
            className="bg-gray-800 text-white border-gray-700"
          />
          <StatsCard
            title="Daily Limit"
            value={`₹${dailySpending}/${user?.dailyLimit}`}
            subtitle="Today's spending limit"
            className="bg-gray-800 text-white border-gray-700"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-gray-800 text-white border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg font-medium">
                Your Spending
                <select className="bg-gray-700 border-gray-600 rounded-md text-sm">
                  <option>This Week</option>
                  <option>This Month</option>
                  <option>This Year</option>
                </select>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SpendingChart />
            </CardContent>
          </Card>

          <Card className="bg-gray-800 text-white border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg font-medium">
                Spending Habits
                <select className="bg-gray-700 border-gray-600 rounded-md text-sm">
                  <option>This Month</option>
                  <option>Last Month</option>
                  <option>This Year</option>
                </select>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SpendingDonut />
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  { name: "Canteen", color: "#4ade80" },
                  { name: "Stationery", color: "#a78bfa" },
                  { name: "Events", color: "#fbbf24" },
                  { name: "Others", color: "#f43f5e" },
                ].map((category) => (
                  <div key={category.name} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm">{category.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Daily Spending Section */}
        {/* <Card className="bg-gray-800 text-white border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Today's Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-2xl font-bold">₹{dailySpending}</div>
              <div className="text-xs text-muted-foreground">Total Spent Today</div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
