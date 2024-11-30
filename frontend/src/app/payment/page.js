'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Utensils, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Payment() {
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

          <div className="flex justify-center mb-4">
            <div className="bg-black rounded-full p-4">
              <Utensils className="w-12 h-12" />
            </div>
          </div>

          <div className="text-center mb-4">
            <h2 className="text-lg mb-1">Canteen</h2>
            <div className="text-4xl font-bold flex items-center justify-center gap-1">
              {amount}
              <span className="text-lg">₹</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <Button
                key={num}
                variant="ghost"
                className="h-12 text-2xl hover:bg-zinc-800"
                onClick={() => handleNumberClick(num.toString())}
              >
                {num}
              </Button>
            ))}
            <Button
              variant="ghost"
              className="h-12 text-2xl hover:bg-zinc-800 col-start-1"
              onClick={() => handleNumberClick("0")}
            >
              0
            </Button>
            <Button
              variant="ghost"
              className="h-12 text-2xl hover:bg-zinc-800 col-start-3"
              onClick={handleDelete}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          <Button
            className="w-full py-4 text-lg bg-indigo-600 hover:bg-indigo-700 rounded-lg"
            onClick={handlePayment}
          >
            Make Payment
          </Button>
        </div>
      </Card>
    </div>
  )
}
