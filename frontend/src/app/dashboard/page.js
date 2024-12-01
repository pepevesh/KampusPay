'use client'

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCard } from "@/components/stats-card"
import { SpendingChart } from "@/components/spending-chart"
import { SpendingDonut } from "@/components/spending-donut"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function Dashboard() {
  const { user, token } = useAuth();
  const [dailySpending, setDailySpending] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [newDailyLimit, setNewDailyLimit] = useState(user?.dailyLimit || 0);

  useEffect(() => {
    const fetchDailySpending = async () => {
      if (!user?.id || !token) return;

      setIsLoading(true);
      setError(null);

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
        );

        if (!response.ok) {
          throw new Error("Failed to fetch daily spending");
        }

        const data = await response.json();
        setDailySpending(data.totalSpent);
      } catch (error) {
        console.error("Error fetching daily spending:", error);
        setError("Failed to fetch daily spending. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailySpending();
  }, [user?.id, token]);

  const updateDailyLimit = async () => {
    if (!token || !user?.id) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/updateLimit`,
        {
          method: "PATCH",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ dailyLimit: newDailyLimit }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update daily limit");
      }

      const data = await response.json();
      setIsEditingLimit(false);
      user.dailyLimit = newDailyLimit; // Update the user's daily limit
    } catch (error) {
      console.error("Error updating daily limit:", error);
      setError("Failed to update daily limit. Please try again later.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-900 mb-16">
      <div className="w-full max-w-5xl mx-auto space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <StatsCard
            title="Total Balance"
            value={user?.balance}
            className="bg-gray-800 text-white border-gray-700"
          />
          <Card className="bg-gray-800 text-white border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium">Daily Limit</CardTitle>
                {!isEditingLimit ? (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:text-gray-400"
                    onClick={() => setIsEditingLimit(true)}
                  >
                    <Pencil className="h-5 w-5" />
                  </Button>
                ) : null}
              </div>
            </CardHeader>
            <CardContent>
              {isEditingLimit ? (
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    value={newDailyLimit}
                    onChange={(e) => setNewDailyLimit(e.target.value)}
                    className="bg-gray-700 text-white"
                  />
                  <Button
                    onClick={updateDailyLimit}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={() => setIsEditingLimit(false)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <p className="text-2xl">
                  ₹{dailySpending}/{user?.dailyLimit}
                </p>
              )}
            </CardContent>
          </Card>
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
      </div>
    </div>
  );
}
