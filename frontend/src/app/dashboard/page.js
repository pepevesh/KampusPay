"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/stats-card";
import { SpendingChart } from "@/components/spending-chart";
import { SpendingDonut } from "@/components/spending-donut";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function Dashboard() {
  const { user, token } = useAuth();
  const [dailySpending, setDailySpending] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [userDailyLimit, setUserDailyLimit] = useState(0);
  const [adminUserIdInput, setAdminUserIdInput] = useState(0);
  const [adminHashedUserIdInput, setAdminHashedUserIdInput] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [newDailyLimit, setNewDailyLimit] = useState(user?.dailyLimit || 0);

  const [inputValue, setInputValue] = useState("");
  const [adminData, setAdminData] = useState(null);
  const [adminError, setAdminError] = useState(null);

  const isAdmin = user?.userId === "admin";
  const effectiveUserId = isAdmin && adminHashedUserIdInput ? adminUserIdInput : user?.userId;
  const effectiveUserHash = isAdmin && adminHashedUserIdInput ? adminHashedUserIdInput : user?.id;

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!effectiveUserId || !token) return;

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/getUserBalance`,
          { userId: effectiveUserId },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 200) {
          setUserBalance(response.data.balance);
        } else {
          console.error("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const fetchUserDailyLimit = async () => {
      if (!effectiveUserId || !token) return;

      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/getUserDailyLimit`,
          { userId: effectiveUserId },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (response.status === 200) {
          setUserDailyLimit(response.data.dailyLimit);
        } else {
          console.error("Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const fetchDailySpending = async () => {
      if (!effectiveUserHash || !token) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/user/${effectiveUserHash}/daily-spending`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
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

    fetchUserDetails();
    fetchDailySpending();
    fetchUserDailyLimit();
  }, [effectiveUserId, effectiveUserHash, token]);

  const updateDailyLimit = async () => {
    if (!token || !user?.id) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/updateLimit`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newLimit: newDailyLimit, userId : user.userId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update daily limit");
      }

      const data = await response.json();
      setUserDailyLimit(data.user.dailyLimit);
      setIsEditingLimit(false);
    } catch (error) {
      console.error("Error updating daily limit:", error);
      setError("Failed to update daily limit. Please try again later.");
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      setAdminError("Input cannot be empty.");
      return;
    }

    setAdminError(null);
    setAdminUserIdInput(inputValue);
    setAdminHashedUserIdInput(null);

    try {
      console.log(inputValue);
      const responseId = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/${inputValue}/admin-love`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!responseId.ok) {
        throw new Error("Failed to fetch user hashed id");
      }

      const data = await responseId.json();
      console.log(data.userObj._id);
      setAdminHashedUserIdInput(data.userObj._id);
      setAdminData(data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setAdminError("Unable to fetch data. Please check the input value.");
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
            value={`₹${userBalance}`}
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
                  ₹{dailySpending}/{userDailyLimit}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Admin Functionality */}
        {user?.userId === "admin" && (
          <Card className="bg-gray-800 text-white border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg font-medium">Admin Panel</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter User ID or Value"
                  className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Fetch Data
                </button>
              </form>
              {adminError && <p className="text-red-500 mt-2">{adminError}</p>}
              {adminData && (
                <div className="mt-4 space-y-2">
                  <p className="text-green-500 font-bold">Fetched Data:</p>
                  <pre className="p-2 bg-gray-700 rounded-md text-white">
                    {JSON.stringify({
                      userId: adminData.userObj.userId,
                      name: adminData.userObj.name,
                      email: adminData.userObj.email,
                      encrypted_id: adminData.userObj._id,
                      balance: adminData.userObj.balance,
                      dailyLimit: adminData.userObj.dailyLimit,
                      usedCoupons: adminData.userObj.usedCoupons,
                    }, null, 2)}
                  </pre>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-gray-800 text-white border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg font-medium">
                Your Spending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SpendingChart
                userId={effectiveUserHash}
              />
            </CardContent>
          </Card>

          <Card className="bg-gray-800 text-white border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-lg font-medium">
                Spending Habits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SpendingDonut
                userId={effectiveUserHash}
              />
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  { name: "Canteen", color: "#4ade80" },
                  { name: "Stationery", color: "#a78bfa" },
                  { name: "Events", color: "#fbbf24" },
                  { name: "Others", color: "#f43f5e" },
                ].map((category) => (
                  <div
                    key={category.name}
                    className="flex items-center space-x-2"
                  >
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
