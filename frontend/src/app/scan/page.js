'use client'

import { useState, useEffect, useRef } from 'react'
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
  const videoRef = useRef(null);

  useEffect(() => {
    // Check if the browser supports getUserMedia
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(() => {
          console.log('Camera access granted');
          setHasCamera(true);
        })
        .catch((err) => {
          console.error('Camera access error:', err);
          setError(`Camera access is required to scan QR codes. Error: ${err.message}`);
        });
    } else {
      console.error('getUserMedia is not supported');
      setError('Your browser does not support camera access');
    }
  }, [])

  useEffect(() => {
    if (hasCamera) {
      console.log('QrReader component should mount now');
    }
  }, [hasCamera]);

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

  useEffect(() => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      }
    }
  }, [videoRef]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="w-full max-w-md bg-gray-800 text-gray-100 border-gray-700">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-center mb-4">Scan QR Code</h1>
          <div className="mb-4">
            {hasCamera ? (
              <>
                <div className="text-center text-white mb-2">Camera should open below:</div>
                <QrReader
                  key={key}
                  onResult={(result) => {
                    if (result) {
                      console.log('QR code scanned:', result);
                      handleScan(result.text);
                    }
                  }}
                  constraints={{
                    facingMode: 'environment'
                  }}
                  videoId="qr-video"
                  videoRef={videoRef}
                  containerStyle={{ width: '100%' }}
                  videoStyle={{ width: '100%' }}
                  onError={(error) => {
                    console.error('QrReader error:', error);
                    setError(`QR Scanner error: ${error.message || 'Unknown error'}`);
                  }}
                />
              </>
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

