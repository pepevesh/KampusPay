'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/context/AuthContext'

export default function ProfilePage() {
  const [showQR, setShowQR] = useState(false)
  const {user,logout} =useAuth();

  // Placeholder user data
  const user1 = {
    id: '12345',
    name: 'John Doe',
    dailyLimit: 1000
  }

  const handleLogout = () => {
    logout();
  }

  const generateQR = () => {
    setShowQR(true)
  }

  // Create QR code data
  const qrData = user?.qrcode;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 ">
      <Card className="w-full max-w-md bg-white shadow-lg rounded-2xl overflow-hidden md:mb-40">
        <CardHeader className="bg-primary p-6">
          <CardTitle className="text-2xl font-bold text-white">User Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div>
            <Label htmlFor="userId" className="text-sm font-medium text-gray-500">User ID</Label>
            <div id="userId" className="text-lg font-semibold text-gray-900">{user?.userId}</div>
          </div>
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-500">Name</Label>
            <div id="name" className="text-lg font-semibold text-gray-900">{user?.name}</div>
          </div>
          <div>
            <Label htmlFor="dailyLimit" className="text-sm font-medium text-gray-500">Daily Limit</Label>
            <div id="dailyLimit" className="text-lg font-semibold text-gray-900">${user?.dailyLimit}</div>
          </div>
          {showQR && (
            <div className="mt-6 flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <QRCodeSVG
                  value={qrData}
                  size={150}
                  level="H"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">Scan to pay</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between p-6 bg-gray-50">
          <Button variant="outline" onClick={handleLogout} className="text-gray-700 hover:bg-gray-200 border-gray-300">
            Logout
          </Button>
          <Button 
            onClick={generateQR} 
            className="bg-primary text-white hover:bg-primary/90"
          >
            {showQR ? 'Hide QR' : 'Generate QR'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}