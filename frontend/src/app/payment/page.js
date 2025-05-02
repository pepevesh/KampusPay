"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { User, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function Payment() {
  const [amount, setAmount] = useState("0");
  const [inputAmount, setInputAmount] = useState("");
  const [vendorId, setVendorId] = useState("");
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const vendors = [
    {
      id: "canteen1",
      category: "canteen",
    },
    {
      id: "stationery1",
      category: "stationery",
    },
    {
      id: "recreation1",
      category: "recreation",
    },
    {
      id: "events1",
      category: "events",
    },
  ];

  useEffect(() => {
    const id = searchParams.get("vendorId");
    if (id) {
      setVendorId(id);
    }
  }, [searchParams]);

  const handleNumberClick = (num) => {
    if (inputAmount.length < 8) {
      const newAmount = inputAmount + num;
      setInputAmount(newAmount);
      setAmount((parseFloat(newAmount) / 100).toFixed(2));
    }
  };

  const handleDelete = () => {
    if (inputAmount.length > 0) {
      const newAmount = inputAmount.slice(0, -1);
      setInputAmount(newAmount);
      setAmount(newAmount ? (parseFloat(newAmount) / 100).toFixed(2) : "0.00");
    }
  };

  const handlePayment = () => {
    setIsPinModalOpen(true);
  };

  const handlePinNumberClick = (num) => {
    if (pin.length < 4) {
      setPin(pin + num);
    }
  };

  const handlePinDelete = () => {
    setPin(pin.slice(0, -1));
  };

  function getCategoryByVendorId(vendorId) {
    const vendor = vendors.find((v) => v.id === vendorId);
    return vendor ? vendor.category : "unknown";
  }

  const handlePinSubmit = async () => {
    const category = getCategoryByVendorId(vendorId);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/transaction/createTransaction`,
        {
          senderId: user.userId,
          receiverId: vendorId,
          amount: parseInt(amount),
          category,
          pin: pin,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 200) {
        router.push("/wallet");
      } else {
        setError("Transaction failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsPinModalOpen(false);
      setPin("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Card className="w-full bg-gray-800 text-gray-100 border-gray-700 max-w-[350px] md:max-w-md -mt-20">
        <div className="p-4 flex flex-col h-[75vh]">
          <Button
            variant="ghost"
            className="self-start mb-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="text-center mb-4">
            <h1 className="text-2xl mb-2">Payment</h1>
            <p className="text-sm text-gray-400">
              ID: {vendorId || "Not specified"}
            </p>
          </div>

          <div className="flex justify-center mb-4">
            <div className="bg-black rounded-full p-4">
              <User className="w-12 h-12" />
            </div>
          </div>

          <div className="text-center mb-4">
            <h2 className="text-lg mb-1">User</h2>
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

      {/* PIN Modal */}
      {isPinModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-[300px] bg-gray-800 text-gray-100 border-gray-700">
            <div className="p-4">
              <h2 className="text-xl mb-4 text-center">Enter PIN</h2>
              <div className="flex justify-center mb-4">
                <div className="bg-gray-700 rounded-lg p-2 w-32">
                  <div className="flex justify-between">
                    {[1, 2, 3, 4].map((_, index) => (
                      <div
                        key={index}
                        className={`w-4 h-4 rounded-full ${
                          pin.length > index ? "bg-indigo-500" : "bg-gray-500"
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <Button
                    key={num}
                    variant="ghost"
                    className="h-12 text-2xl hover:bg-zinc-700"
                    onClick={() => handlePinNumberClick(num.toString())}
                  >
                    {num}
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  className="h-12 text-2xl hover:bg-zinc-700 col-start-2"
                  onClick={() => handlePinNumberClick("0")}
                >
                  0
                </Button>
                <Button
                  variant="ghost"
                  className="h-12 text-2xl hover:bg-zinc-700 col-start-3"
                  onClick={handlePinDelete}
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <Button
                className="w-full py-4 text-lg bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                onClick={handlePinSubmit}
                disabled={pin.length !== 4}
              >
                Confirm Payment
              </Button>
              {error && (
                <p className="text-red-500 text-center mt-2">{error}</p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
