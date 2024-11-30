'use client'

import { useState } from 'react'
import { Utensils, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function Pay() {
  const [amount, setAmount] = useState("300.00")
  const [inputAmount, setInputAmount] = useState("")

  const handleNumberClick = (num) => {
    if (inputAmount.length < 8) {
      const newAmount = inputAmount + num
      setInputAmount(newAmount)
      setAmount((parseFloat(newAmount) / 100).toFixed(2))
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
    // Payment processing logic would go here
    console.log(`Processing payment for ${amount}`)
  }

  return (
    <Card className="max-w-md mx-auto bg-zinc-900 text-white min-h-screen">
      <div className="p-6 flex flex-col h-screen">
        <div className="text-center mb-6">
          <h1 className="text-2xl mb-4">Payment</h1>
          <p className="text-sm text-gray-400">Vendor ID: 34</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-black rounded-full p-6">
            <Utensils className="w-12 h-12" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-lg mb-2">Canteen</h2>
          <div className="text-4xl font-bold flex items-center justify-center gap-2">
            {amount}
            <span className="text-lg">₹</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              variant="ghost"
              className="h-16 text-2xl hover:bg-zinc-800"
              onClick={() => handleNumberClick(num.toString())}
            >
              {num}
            </Button>
          ))}
          <Button
            variant="ghost"
            className="h-16 text-2xl hover:bg-zinc-800"
            onClick={() => handleNumberClick("0")}
          >
            0
          </Button>
          <Button
            variant="ghost"
            className="h-16 text-2xl hover:bg-zinc-800 col-span-2"
            onClick={handleDelete}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <Button 
          className="w-full py-6 text-lg bg-indigo-600 hover:bg-indigo-700 rounded-xl"
          onClick={handlePayment}
        >
          Make Payment
        </Button>
      </div>
    </Card>
  )
}

