'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
  });
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsError(false);
    setIsLoading(true);

    try {
      await login(formData);
    } catch (error) {
      setIsError(true);
      setErrorMessage("Login failed. Please check your credentials.");
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="w-full bg-gray-800 text-gray-100 border-gray-700 max-w-[350px] md:max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight flex items-center gap-3 text-[#7F3DFF]">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7F3DFF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#7F3DFF]"></span>
            </span>
            Login
          </CardTitle>
          <CardDescription className="text-gray-400">
            Sign in to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {isError && (
              <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="userId" className="text-gray-300">User ID</Label>
              <Input
                id="userId"
                type="text"
                placeholder="Enter your User ID"
                required
                className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-[#7F3DFF] focus:ring-[#7F3DFF]"
                value={formData.userId}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                required
                className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-[#7F3DFF] focus:ring-[#7F3DFF]"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#7F3DFF] hover:bg-[#6A2FD9] text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            <p className="text-sm text-center text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#7F3DFF] hover:underline">
                Register
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}