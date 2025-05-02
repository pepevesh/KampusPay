"use client";

import { useState, useEffect } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { useAuth } from "@/context/AuthContext";

export function SpendingDonut() {
  const [categoryData, setCategoryData] = useState([]); // State to hold category-wise data
  const [totalAmount, setTotalAmount] = useState(0); // State to hold total amount spent
  const { user, token } = useAuth(); // Replace with dynamic user ID (e.g., from context or session)

  useEffect(() => {
    // Fetch category-wise transaction data
    const fetchCategoryData = async () => {
      try {
        console.log(user);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/category/${user?.id}/categories`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch category data");
        }

        const data = await response.json();
        console.log(data);

        // Map response to chart data format
        const chartData = data.map((item) => ({
          name: item._id,
          value: Math.abs(item.totalAmount),
          color: getCategoryColor(item._id),
        }));

        setCategoryData(chartData);

        // Calculate total amount spent (absolute value of totalAmount)
        const total = data.reduce(
          (acc, item) => acc + Math.abs(item.totalAmount),
          0,
        );
        setTotalAmount(total);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    };

    if (user && token) {
      fetchCategoryData();
    }
  }, [user, token]);

  // Function to get color based on category name
  const getCategoryColor = (category) => {
    switch (category) {
      case "canteen":
        return "#4ade80";
      case "stationery":
        return "#a78bfa";
      case "recreation":
        return "#f43f5e";
      case "events":
        return "#fbbf24";
      default:
        return "#ffffff";
    }
  };

  return (
    <div className="relative h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold">₹{totalAmount}</div>
          <div className="text-xs text-muted-foreground">Total Spent</div>
        </div>
      </div>
    </div>
  );
}
