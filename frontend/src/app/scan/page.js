'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Html5Qrcode } from "html5-qrcode"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from 'axios'

export default function Scanner() {
  const [error, setError] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [html5QrCode, setHtml5QrCode] = useState(null)
  const [manualVendorId, setManualVendorId] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')

  useEffect(() => {
    const scanner = new Html5Qrcode("reader")
    setHtml5QrCode(scanner)

    return () => {
      if (scanner && scanning) {
        scanner.stop().catch((err) => console.error('Error stopping scanner:', err))
      }
    }
  }, [])

  const startScanner = async () => {
    if (!html5QrCode) return

    try {
      setError(null)
      setScanning(true)

      const hasPermission = await navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(() => true)
        .catch(() => false)

      if (!hasPermission) {
        setError('Camera permission is required')
        return
      }

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 15,
          qrbox: { width: 300, height: 300 },
        },
        async (decodedText) => {
          try {
            const jsontext = { encryptedqr: decodedText }
            console.log(jsontext)

            if (jsontext.encryptedqr) {
              html5QrCode.stop().catch(console.error)
              try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/qr/decrypt`, { encryptedqr: jsontext.encryptedqr })
                console.log(response)

                if (response.data.userId) {
                  // Include both userId from QR and from URL params if they exist
                  const paymentUserId = userId || response.data.userId
                  router.push(`/payment?vendorId=${paymentUserId}`)
                } else {
                  setError('Failed to decrypt QR code or no user ID found')
                }
              } catch (err) {
                setError('Error decrypting QR code with the backend')
                console.error('Axios error:', err)
              }
            } else {
              setError('Invalid QR code format')
            }
          } catch (e) {
            setError('Error processing QR code')
          }
        }
      )
    } catch (err) {
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
    startScanner()

    return () => {
      stopScanner()
    }
  }, [html5QrCode])

  const handleManualEntry = () => {
    if (manualVendorId.trim()) {
      // Include userId in the manual entry navigation if it exists
      const queryParams = new URLSearchParams()
      queryParams.append('vendorId', manualVendorId.trim())
      if (userId) {
        queryParams.append('userId', userId)
      }
      router.push(`/payment?${queryParams.toString()}`)
    } else {
      setError('Please enter a valid Vendor ID')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="w-full max-w-md bg-gray-800 text-gray-100 border-gray-700">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-center mb-4">Scan QR Code</h1>

          <div className="mb-4">
            <div id="reader" className="w-full"></div>
            {error && (
              <div className="text-red-500 text-center mt-4">
                {/* {error} */}
                <Button
                  className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
                  onClick={startScanner}
                >
                  Retry Scanner
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Enter Vendor ID manually"
              value={manualVendorId}
              onChange={(e) => setManualVendorId(e.target.value)}
              className="w-full py-2 px-3 bg-gray-700 text-gray-100 rounded-lg"
            />
            <Button
              className="w-full py-4 text-lg bg-indigo-600 hover:bg-indigo-700 rounded-lg"
              onClick={handleManualEntry}
            >
              Enter Vendor ID Manually
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}