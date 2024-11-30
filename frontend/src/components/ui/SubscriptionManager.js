'use client';

import { useState, useEffect } from 'react';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')    // Fixed regex
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true);
      registerServiceWorker().catch(err => {
        console.error('Service Worker registration failed:', err);
        setError(err.message);
      });
    }
  }, []);

  async function registerServiceWorker() {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    } catch (err) {
      console.error('Service Worker registration failed:', err);
      setError(err.message);
    }
  }

  async function subscribeToPush() {
    try {
      // First request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        throw new Error('Permission not granted for notifications');
      }

      const registration = await navigator.serviceWorker.ready;
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BPWMHbrkYka74HGPFmAKBKkMWtGE9cuCLF1EgdhST_Z5Fc_EU33RC8w122U39jTv3y4k9vKi4f1TKgkQgRz07gg"
        ),
      });
      
      setSubscription(sub);
      
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL+'/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscription: sub }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save subscription on server');
      }
    } catch (err) {
      console.error('Subscription failed:', err);
      setError(err.message);
    }
  }

  async function unsubscribeFromPush() {
    try {
      if (subscription) {
        await subscription.unsubscribe();
        setSubscription(null);
        
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL+'/api/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ subscription }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to remove subscription from server');
        }
      }
    } catch (err) {
      console.error('Unsubscribe failed:', err);
      setError(err.message);
    }
  }

  async function sendTestNotification() {
    try {
      if (!subscription) {
        throw new Error('No active subscription');
      }
      
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL+'/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send notification');
      }
      
      setMessage('');
    } catch (err) {
      console.error('Send notification failed:', err);
      setError(err.message);
    }
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  return (
    <div>
      <h3>Push Notifications</h3>
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          Error: {error}
          <button onClick={() => setError(null)}>Clear</button>
        </div>
      )}
      {subscription ? (
        <>
          <p>You are subscribed to push notifications.</p>
          <button onClick={unsubscribeFromPush}>Unsubscribe</button>
          <div>
            <input
              type="text"
              placeholder="Enter notification message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendTestNotification}>Send Test</button>
          </div>
        </>
      ) : (
        <>
          <p>You are not subscribed to push notifications.</p>
          <button onClick={subscribeToPush}>Subscribe</button>
        </>
      )}
    </div>
  );
}

export default PushNotificationManager;