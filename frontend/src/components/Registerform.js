'use client'

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Link from "next/link"
import axios from 'axios'

export default function RegisterForm() {
  const API_URL= process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter()
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    pin: ""
  })
  const [otp, setOtp] = useState("")
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isOtpSent, setIsOtpSent] = useState(false)

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  // Send OTP to user's email
  const handleSendOtp = async () => {
    try {
      console.log(API_URL)
      const response = await axios.post(API_URL+'/api/user/userotp', { email: formData.email })
      if (response.data.success) {
        setIsOtpSent(true)
        setIsOtpModalOpen(true)
      } else {
        console.error('Failed to send OTP')
      }
    } catch (error) {
      console.error('Error during OTP sending:', error)
    }
  }

  // Verify OTP entered by the user
  const handleOtpVerification = async () => {
    try {
      const response = await axios.post(API_URL+'/api/user/verifyuserotp', {
        email: formData.email,
        otp
      })
      if (response.data.success) {
        console.log("done")
        setIsOtpModalOpen(false)
        handleRegisterUser() // Proceed to register after OTP is verified
      } else {
        console.error('OTP verification failed')
      }
    } catch (error) {
      console.error('Error during OTP verification:', error)
    }
  }

  // Register the user after OTP is verified
  const handleRegisterUser = async () => {
    try {
      const response = await axios.post(API_URL+'/api/user/createUser', formData)
      if (response.data.success) {
        setIsSuccessModalOpen(true)
      } else {
        console.error('Registration failed')
      }
    } catch (error) {
      console.error('Error during registration:', error)
    }
  }

  const handleSuccessModalClose = () => {
    setIsSuccessModalOpen(false)
    router.push('/')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card
        className="w-full bg-gray-800 text-gray-100 border-gray-700 max-w-[350px] md:max-w-md">
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
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }}>
            <div className="space-y-2">
              <Label htmlFor="id" className="text-gray-300">ID (Roll no)</Label>
              <Input
                id="id"
                placeholder="21BD1A661O"
                required
                className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-[#7F3DFF] focus:ring-[#7F3DFF]"
                value={formData.id}
                onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                required
                className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-[#7F3DFF] focus:ring-[#7F3DFF]"
                value={formData.name}
                onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john.doe@example.com"
                required
                className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-[#7F3DFF] focus:ring-[#7F3DFF]"
                value={formData.email}
                onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                required
                className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-[#7F3DFF] focus:ring-[#7F3DFF]"
                value={formData.password}
                onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin" className="text-gray-300">Pin</Label>
              <Input
                id="pin"
                type="password"
                placeholder="****"
                maxLength={4}
                required
                className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-[#7F3DFF] focus:ring-[#7F3DFF]"
                value={formData.pin}
                onChange={handleInputChange} />
            </div>

            <Button
              type="submit"
              className="w-full bg-[#7F3DFF] hover:bg-[#6A2FD9] text-white">
              Send OTP
            </Button>

            <p className="text-sm text-center text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-[#7F3DFF] hover:underline">
                Login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>

      {/* OTP Verification Modal */}
      <Dialog open={isOtpModalOpen} onOpenChange={setIsOtpModalOpen}>
        <DialogContent className="bg-gray-800 text-gray-100 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-[#7F3DFF]">OTP Verification</DialogTitle>
            <DialogDescription className="text-gray-400">
              Please enter the OTP sent to your email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-[#7F3DFF] focus:ring-[#7F3DFF]" />
            <Button
              onClick={handleOtpVerification}
              className="w-full bg-[#7F3DFF] hover:bg-[#6A2FD9] text-white">
              Verify OTP
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Registration Success Modal */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="bg-gray-800 text-gray-100 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-[#7F3DFF]">Registration Successful</DialogTitle>
            <DialogDescription className="text-gray-400">
              Your account has been created successfully.
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={handleSuccessModalClose}
            className="w-full bg-[#7F3DFF] hover:bg-[#6A2FD9] text-white">
            Go to Login
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
