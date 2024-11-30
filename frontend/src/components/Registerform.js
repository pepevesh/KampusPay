"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function RegisterForm() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="w-full bg-gray-800 text-gray-100 border-gray-700 max-w-[350px] md:max-w-md">
        <CardHeader>
          <CardTitle
            className="text-2xl font-semibold tracking-tight flex items-center gap-3 text-[#7F3DFF]">
            <span className="relative flex h-3 w-3">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7F3DFF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#7F3DFF]"></span>
            </span>
            Register
          </CardTitle>
          <CardDescription className="text-gray-400">
            Sign up now and get full access to our app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            {/* ID (Roll No) */}
            <div className="space-y-2">
              <Label htmlFor="id" className="text-gray-300">ID (Roll no)</Label>
              <Input
                id="id"
                placeholder="21BD1A661O"
                required
                className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-[#7F3DFF] focus:ring-[#7F3DFF]" />
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                required
                className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-[#7F3DFF] focus:ring-[#7F3DFF]" />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                required
                className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-[#7F3DFF] focus:ring-[#7F3DFF]" />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                required
                className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-[#7F3DFF] focus:ring-[#7F3DFF]" />
            </div>

            {/* Pin */}
            <div className="space-y-2">
              <Label htmlFor="pin" className="text-gray-300">Pin</Label>
              <Input
                id="pin"
                type="password"
                placeholder="****"
                maxLength={4}
                required
                className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-[#7F3DFF] focus:ring-[#7F3DFF]" />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#7F3DFF] hover:bg-[#6A2FD9] text-white ">
              Register
            </Button>

            {/* Sign In Link */}
            <p className="text-sm text-center text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-[#7F3DFF] hover:underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
