'use client'
import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Utensils, Printer, User, Megaphone, X } from 'lucide-react'
import RazorpayPayment from "@/components/Razorpay"
import { useAuth } from '@/context/AuthContext'

export default function Wallet() {
  const [isModalOpen, setModalOpen] = useState(false)
  const {user} = useAuth()
  const transactions = [
    {
      id: '1',
      icon: <Utensils className="h-6 w-6" />,
      title: 'Canteen',
      description: 'Papdi chaat, KitKat',
      amount: 50,
      time: '01:37 PM',
      type: 'expense'
    },
    {
      id: '2',
      icon: <Printer className="h-6 w-6" />,
      title: 'Stationery',
      description: 'Printouts',
      amount: 25,
      time: '03:12 PM',
      type: 'expense'
    },
    {
      id: '3',
      icon: <User className="h-6 w-6" />,
      title: 'Koushik',
      description: '21BD1A6607',
      amount: 3000,
      time: '04:55 PM',
      type: 'income'
    },
    {
      id: '4',
      icon: <Megaphone className="h-6 w-6" />,
      title: 'Events',
      description: 'Codenovate registration',
      amount: 400,
      time: '08:30 PM',
      type: 'expense'
    }
  ]

  const handleOpenModal = () => setModalOpen(true)
  const handleCloseModal = () => setModalOpen(false)

  return (
    <div className="min-h-screen bg-gray-900 pb-20 flex justify-center">
  <div className="p-4 md:max-w-5xl w-full">
    <h1 className="text-2xl font-bold text-white mb-4">Wallet</h1>

    {/* Balance Card */}
    <Card className="w-full bg-[#7F3DFF] p-6 mb-6 rounded-2xl">
      <div className="bg-black rounded-xl p-6 text-white">
        <h2 className="text-lg mb-2">Total Balance</h2>
        <div className="flex items-center gap-2">
          <span className="text-5xl font-bold">310.00</span>
          <span className="text-2xl">₹</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button onClick={handleOpenModal} className="bg-[#7F3DFF] hover:bg-[#7F3DFF]/90 text-white py-6">
            Add
          </Button>
          <Button className="bg-[#7F3DFF] hover:bg-[#7F3DFF]/90 text-white py-6">
            Withdraw
          </Button>
        </div>
      </div>
    </Card>

    {/* Transactions */}
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Today</h2>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between bg-gray-800 p-4 rounded-xl"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-700 p-3 rounded-xl">
                {transaction.icon}
              </div>
              <div>
                <h3 className="text-white font-medium">{transaction.title}</h3>
                <p className="text-gray-400 text-sm">{transaction.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-lg font-semibold ${
                transaction.type === 'income' ? 'text-green-500' : 'text-red-500'
              }`}>
                {transaction.type === 'income' ? '+' : '-'} {transaction.amount}₹
              </p>
              <p className="text-gray-400 text-sm">{transaction.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>

  {/* Modal */}
  {isModalOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <Card className="w-full max-w-md p-6 bg-white dark:bg-gray-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Add Balance</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCloseModal}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
        <RazorpayPayment onClose={handleCloseModal} />
      </Card>
    </div>
  )}
</div>
  )
}