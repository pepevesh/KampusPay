'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

const RazorpayPayment = ({ onClose }) => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [loading, setLoading] = useState(false);
  const {user,token} = useAuth();

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    if (!amount || isNaN(amount)) {
      alert("Please enter a valid amount.");
      return;
    }

    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      alert("Failed to load Razorpay SDK. Please try again later.");
      return;
    }

    setLoading(true);

    try {
        const id= user.userId;
      console.log(amount)
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL+"/api/payment/makePayment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId:id,amount }),
      });

      const order = await response.json();

      if (response.ok) {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Changed to NEXT_PUBLIC_
          amount: order.amount,
          currency: order.currency,
          name: "Your Company Name",
          description: "Add Balance",
          order_id: order.id,
          handler: (response) => {
            alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
            onClose();
          },
          prefill: {
            name: "Your Customer Name",
            email: "customer@example.com",
            contact: "1234567890",
          },
          theme: {
            color: "#7F3DFF",
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();

        razorpay.on("payment.failed", function (response) {
          alert(`Payment failed: ${response.error.description}`);
        });
      } else {
        alert("Failed to create Razorpay order. Please try again.");
      }
    } catch (error) {
      console.error("Error during payment:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Amount (in ₹)
        </label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full"
        />
      </div>

      <div>
        <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Currency
        </label>
        <select
          id="currency"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white dark:bg-gray-700 px-3 py-2"
        >
          <option value="INR">INR</option>
          <option value="USD">USD</option>
        </select>
      </div>

      <Button
        onClick={handlePayment}
        disabled={loading}
        className="w-full bg-[#7F3DFF] hover:bg-[#6A2FD9] text-white"
      >
        {loading ? "Processing..." : "Pay Now"}
      </Button>
    </div>
  );
};

export default RazorpayPayment;