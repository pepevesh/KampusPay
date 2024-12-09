'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/context/AuthContext';
// import { useToast } from "@/components/ui/use-toast";

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


export default function ProfilePage() {
  const [showQR, setShowQR] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false);
  const { user, logout, token } = useAuth();
  // const { toast } = useToast();

  // Check subscription status on component mount
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        if (!('serviceWorker' in navigator)) {
          console.log('Service Worker not supported');
          return;
        }

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } catch (error) {
        console.error('Error checking subscription:', error);
      }
    };

    checkSubscription();
  }, []);

  const handleLogout = () => {
    logout();
  };

  const toggleQR = () => {
    setShowQR((prev) => !prev); // Toggle the QR code display
  };

  const subscribeToPush = async () => {
    setIsSubscriptionLoading(true);
    try {
      // Check if service workers are supported
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service Worker not supported');
      }

      // Register service worker if not already registered
      const registration = await navigator.serviceWorker.register('/sw.js');
      await registration.update();

      // Request notification permissions
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Notification permission denied');
      }

      // Get the push subscription
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
      });

      // Save subscription to the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notif/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          subscription: subscription.toJSON(),
          userId: user?.userId 
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      setIsSubscribed(true);
      // toast({
      //   title: "Successfully subscribed to notifications",
      //   variant: "success",
      // });
    } catch (error) {
      console.error('Failed to subscribe:', error);
      // toast({
      //   title: "Failed to subscribe",
      //   description: error.message,
      //   variant: "destructive",
      // });
    } finally {
      setIsSubscriptionLoading(false);
    }
  };

  const unsubscribeFromPush = async () => {
    setIsSubscriptionLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      
      if (subscription) {
        await subscription.unsubscribe();
        
        // Remove subscription from the backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notif/unsubscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ userId: user?.userId }),
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        setIsSubscribed(false);
        // toast({
        //   title: "Successfully unsubscribed from notifications",
        //   variant: "success",
        // });
      }
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      // toast({
      //   title: "Failed to unsubscribe",
      //   description: error.message,
      //   variant: "destructive",
      // });
    } finally {
      setIsSubscriptionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
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
          {showQR && (
            <div className="mt-6 flex flex-col items-center">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <QRCodeSVG value={user?.qrcode || ''} size={150} level="H" />
              </div>
              <p className="mt-2 text-sm text-gray-500">Scan to pay</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between p-6 bg-gray-50">
          <Button variant="outline" onClick={handleLogout} className="text-gray-700 hover:bg-gray-200 border-gray-300">
            Logout
          </Button>
          <Button onClick={toggleQR} className="bg-primary text-white hover:bg-primary/90">
            {showQR ? 'Hide QR' : 'Generate QR'}
          </Button>
        </CardFooter>
        <CardFooter className="p-6 bg-gray-50">
          <Button 
            onClick={isSubscribed ? unsubscribeFromPush : subscribeToPush} 
            className={`w-full ${isSubscribed ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
            disabled={isSubscriptionLoading}
          >
            {isSubscriptionLoading 
              ? 'Processing...' 
              : (isSubscribed ? 'Unsubscribe from Notifications' : 'Subscribe to Notifications')
            }
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}