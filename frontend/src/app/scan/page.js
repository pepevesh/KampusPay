'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Html5Qrcode } from "html5-qrcode"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Scanner() {
  const [error, setError] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [html5QrCode, setHtml5QrCode] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Initialize scanner instance
    const scanner = new Html5Qrcode("reader")
    setHtml5QrCode(scanner)

    // Cleanup on component unmount
    return () => {
      if (scanner && scanning) {
        scanner.stop().catch(console.error)
      }
    }
  }, [])

  const startScanner = async () => {
    if (!html5QrCode) return

    try {
      setError(null)
      setScanning(true)

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Success callback
          try {
            const parsedData = JSON.parse(decodedText)
            console.log(decodedText)
            if (parsedData.vendorId) {
              html5QrCode.stop().catch(console.error)
              router.push(`/pay?vendorId=${parsedData.vendorId}`)
            } else {
              setError('Invalid QR code: No vendor ID found')
            }
          } catch (e) {
            setError('Invalid QR code format')
          }
        },
        (errorMessage) => {
          // Error callback
          console.log(errorMessage)
        }
      )
    } catch (err) {
      console.error('Scanner error:', err)
      setError(`Camera access error: ${err.message || 'Unknown error'}`)
      setScanning(false)
    }
  }

  const stopScanner = async () => {
    if (html5QrCode && scanning) {
      try {
        await html5QrCode.stop()
        setScanning(false)
      } catch (err) {
        console.error('Failed to stop scanner:', err)
      }
    }
  }

  useEffect(() => {
    // Start scanner when component mounts
    startScanner()
    
    // Cleanup on unmount
    return () => {
      stopScanner()
    }
  }, [html5QrCode])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="w-full max-w-md bg-gray-800 text-gray-100 border-gray-700">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-center mb-4">Scan QR Code</h1>
          
          <div className="mb-4">
            <div id="reader" className="w-full"></div>
            {error && (
              <div className="text-red-500 text-center mt-4">
                {error}
                <Button
                  className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                  onClick={startScanner}
                >
                  Retry Scanner
                </Button>
              </div>
            )}
          </div>

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