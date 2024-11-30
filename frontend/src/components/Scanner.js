'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Dynamically import QrReader with ssr option set to false
const QrReader = dynamic(() => import('react-qr-reader').then((mod) => {
  const Reader = mod.default || mod.QrReader || mod;
  return { default: Reader };
}), {
  ssr: false,
})

export default function Scanner() {
  const [error, setError] = useState(null)
  const [hasCamera, setHasCamera] = useState(false)
  const [key, setKey] = useState(0) // Add a key state to force re-render
  const router = useRouter()

  useEffect(() => {
    // Check if the browser supports getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => setHasCamera(true))
        .catch(() => setError('Camera access is required to scan QR codes'))
    } else {
      setError('Your browser does not support camera access')
    }
  }, [])

  const handleScan = (data) => {
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        if (parsedData.vendorId) {
          router.push(`/pay?vendorId=${parsedData.vendorId}`);
        } else {
          setError('Invalid QR code: No vendor ID found');
        }
      } catch (e) {
        setError('Invalid QR code format');
      }
    }
  };

  const handleError = (err) => {
    console.error('QR Scanner error:', err);
    setError(`QR Scanner error: ${err.message || 'Unknown error'}`);
  };

  const retryScanner = () => {
    setKey(prevKey => prevKey + 1) // Increment key to force re-render
    setError(null) // Clear any previous errors
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="w-full max-w-md bg-gray-800 text-gray-100 border-gray-700">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-center mb-4">Scan QR Code</h1>
          <div className="mb-4">
            {hasCamera ? (
              <QrReader
                key={key}
                onResult={(result) => {
                  if (result) {
                    handleScan(result.text);
                  }
                }}
                constraints={{
                  facingMode: 'environment'
                }}
                containerStyle={{ width: '100%' }}
                videoStyle={{ width: '100%' }}
              />
            ) : (
              <div className="text-center text-yellow-500 mb-4">
                {error || 'Checking camera access...'}
              </div>
            )}
          </div>
          {error && (
            <div className="text-red-500 text-center mb-4">
              {error}
              <Button
                className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                onClick={retryScanner}
              >
                Retry Scanner
              </Button>
            </div>
          )}
          <Button
            className="w-full py-4 text-lg bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            onClick={() => router.push('/pay')}
          >
            Enter Vendor ID Manually
          </Button>
        </div>
      </Card>
    </div>
  )
}

