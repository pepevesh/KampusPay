"use client";

import { useState, useEffect } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useAuth } from "@/context/AuthContext";

export function SpendingChart({ userId }) {
  const [weeklyData, setWeeklyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchWeeklySpending = async () => {
      if (!user?.id || !token) {
        setError("User not authenticated");
        setIsLoading(false);
        return;
      }

      if (!process.env.NEXT_PUBLIC_API_URL) {
        setError("API URL is not configured");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/${userId}/weekly-spending`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          const { message } = await response.json();
          throw new Error(message || "Failed to fetch weekly spending");
        }

        const { spendingByDay } = await response.json();

        const daysOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const currentDayIndex = new Date().getDay();
        const chartData = spendingByDay.map((spending, index) => ({
          name:
            index === 6
              ? "Today"
              : daysOfWeek[(currentDayIndex + 7 - 6 + index) % 7],
          spending,
          isToday: index === 6, // Flag for the "Today" bar
        }));

        setWeeklyData(chartData);
      } catch (error) {
        setError(error.message || "An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklySpending();
  }, [user, token]);

  if (isLoading) {
    return (
      <p className="text-gray-500 text-center">Loading weekly spending...</p>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">Error: {error}</p>;
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={weeklyData}>
          <XAxis dataKey="name" tick={{ fill: "#4A5568" }} />
          <YAxis tick={{ fill: "#4A5568" }} />
          <Tooltip formatter={(value) => [`$${value}`, "Spending"]} />
          <Bar
            dataKey="spending"
            shape={(props) => {
              const { x, y, width, height, payload } = props;
              const color = payload.isToday
                ? "#3182CE" // Blue for "Today"
                : payload.spending > (user?.dailyLimit || Infinity)
                  ? "#E53E3E" // Red if spending exceeds the limit
                  : "#38A169"; // Green otherwise
              return (
                <rect x={x} y={y} width={width} height={height} fill={color} />
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
