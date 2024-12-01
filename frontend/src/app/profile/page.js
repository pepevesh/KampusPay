'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
  const [qrCode, setQrCode] = useState(null)

  // Placeholder user data
  const user = {
    id: '12345',
    name: 'John Doe',
    dailyLimit: 1000
  }

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...')
  }

  const generateQR = () => {
    // Implement QR code generation logic here
    const placeholderQR = 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ProfileQRCode'
    setQrCode(placeholderQR)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-2xl overflow-hidden">
        <CardHeader className="bg-primary p-6">
          <CardTitle className="text-2xl font-bold text-white">User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div>
            <Label htmlFor="userId" className="text-sm font-medium text-gray-500">User ID</Label>
            <div id="userId" className="text-lg font-semibold text-gray-900">{user.id}</div>
          </div>
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-500">Name</Label>
            <div id="name" className="text-lg font-semibold text-gray-900">{user.name}</div>
          </div>
          <div>
            <Label htmlFor="dailyLimit" className="text-sm font-medium text-gray-500">Daily Limit</Label>
            <div id="dailyLimit" className="text-lg font-semibold text-gray-900">${user.dailyLimit.toLocaleString()}</div>
          </div>
          {qrCode && (
            <div className="mt-6">
              <img src={qrCode} alt="Profile QR Code" className="mx-auto rounded-lg shadow-md" />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between p-6 bg-gray-50">
          <Button variant="outline" onClick={handleLogout} className="text-gray-700 hover:bg-gray-200 border-gray-300">
            Logout
          </Button>
          <Button onClick={generateQR} className="bg-primary text-white hover:bg-primary/90">
            Generate QR
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

