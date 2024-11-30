'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Utensils, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Pay() {
  const [amount, setAmount] = useState("0")
  const [inputAmount, setInputAmount] = useState("")
  const [vendorId, setVendorId] = useState("")
  const searchParams = useSearchParams()

  useEffect(() => {
    const id = searchParams.get('vendorId')
    if (id) {
      setVendorId(id)
    }
  }, [searchParams])

  const handleNumberClick = (num) => {
    if (inputAmount.length < 8) {
      const newAmount = inputAmount + num
      setInputAmount(newAmount)
      setAmount(newAmount)
    }
  }

  const handleDelete = () => {
    if (inputAmount.length > 0) {
      const newAmount = inputAmount.slice(0, -1)
      setInputAmount(newAmount)
      setAmount(newAmount ? (parseFloat(newAmount) / 100).toFixed(2) : "0.00")
    }
  }

  const handlePayment = () => {
    console.log(`Processing payment of ${amount} for vendor ${vendorId}`)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="w-full bg-gray-800 text-gray-100 border-gray-700 max-w-[350px] md:max-w-md  -mt-20">
        <div className="p-4 flex flex-col h-[75vh]">
          <div className="text-center mb-4">
            <h1 className="text-2xl mb-2">Payment</h1>
            <p className="text-sm text-gray-400">Vendor ID: {vendorId || 'Not specified'}</p>
          </div>

          {/* Rest of the component remains the same */}

        </div>
      </Card>
    </div>
  )
}

