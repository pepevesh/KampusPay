'use client'

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Utensils, Printer, User, Megaphone, X, ArrowUpRight, ArrowDownLeft, CreditCard } from 'lucide-react'
import RazorpayPayment from "@/components/Razorpay"
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'

export default function Wallet() {
  const [isModalOpen, setModalOpen] = useState(false)
  const { user, token } = useAuth()
  const [transactions, setTransactions] = useState([])
  const [userDetails, setUserDetails] = useState()

  const fetchTransactions = async () => {
    try {
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/getUserTransactions`, 
        { userId: user.userId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      const response_2 = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/getUserBalance`, 
        { userId: user.userId },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      )
      
      if (response.status === 200) {
        setTransactions(response.data.transactions)
      } else {
        console.error('Failed to fetch transactions')
      }

      if (response_2.status === 200) {
        setUserDetails(response_2.data.balance);
        console.log(response_2.data);
      } else {
        console.error('Failed to fetch user details');
      }

    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchTransactions()
    }
  }, [user])

  const handleOpenModal = () => setModalOpen(true)
  const handleCloseModal = () => setModalOpen(false)

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'food': return <Utensils className="h-6 w-6" />
      case 'print': return <Printer className="h-6 w-6" />
      case 'transfer': return <User className="h-6 w-6" />
      case 'add': return <ArrowDownLeft className="h-6 w-6" />
      case 'withdraw': return <ArrowUpRight className="h-6 w-6" />
      default: return <CreditCard className="h-6 w-6" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 pb-20 flex justify-center">
      <div className="p-4 md:max-w-5xl w-full">
        <h1 className="text-2xl font-bold text-white mb-4">Wallet</h1>

        {/* Balance Card */}
        <Card className="w-full bg-[#7F3DFF] p-6 mb-6 rounded-2xl">
          <div className="bg-black rounded-xl p-6 text-white">
            <h2 className="text-lg mb-2">Total Balance</h2>
            <div className="flex items-center gap-2">
              <span className="text-xl">₹</span>
              <span className="text-5xl font-bold">{userDetails}</span>
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
    {transactions
      .slice() // Create a shallow copy to avoid mutating the original array
      .reverse() // Reverse the array order
      .map((transaction) => (
        <div
          key={transaction.id}
          className="flex items-center justify-between bg-gray-800 p-4 rounded-xl transition-all duration-300 hover:bg-gray-700"
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl ${
                transaction.sender.userId !== user.userId
                  ? 'bg-green-500/20'
                  : 'bg-red-500/20'
              }`}
            >
              {getTransactionIcon(transaction.type)}
            </div>
            <div>
              <h3 className="text-white font-medium">{transaction.title}</h3>
              <p className="text-gray-400 text-sm">{transaction.description}</p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <p
              className={`text-lg font-semibold ${
                transaction.sender.userId !== user.userId ||
                transaction.sender.userId === transaction.receiver.userId
                  ? 'text-green-500'
                  : 'text-red-500'
              }`}
            >
              {transaction.sender.userId === transaction.receiver.userId
                ? '+'
                : transaction.sender.userId !== user.userId
                ? '+'
                : '-'}{' '}
              {transaction.amount}₹
            </p>
            <p className="text-gray-400 text-sm">{transaction.time}</p>
            {transaction.sender.userId !== user.userId && (
              <p className="text-gray-400 text-xs mt-1">
                From: {transaction.sender.userId}
              </p>
            )}
            {transaction.sender.userId === user.userId && (
              <p className="text-gray-400 text-xs mt-1">
                To: {transaction.receiver.userId}
              </p>
            )}
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

  