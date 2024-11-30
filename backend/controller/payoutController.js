const express = require("express");
const axios = require("axios");
const router = express.Router();
const User = require('../model/User');
require('dotenv').config();

// Razorpay Credentials
const keyId = process.env.RAZORPAY_KEY_ID;
const keySecret = process.env.RAZORPAY_SECRET;
const razorpayAuth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");

// Route to create a payout
exports.makePayout = async (req, res) => {
  const { amount, accountType, accountDetails, purpose, currency, userId } = req.body;

  const data = {
    account_type: accountType, // "vpa" (UPI) or "bank_account"
    amount: amount * 100, // Amount in paise
    currency: currency || "INR",
    purpose: purpose || "payout",
    fund_account: {
      account_type: accountType,
      [accountType === "vpa" ? "vpa" : "bank_account"]: accountDetails,
    },
    narration: "Payment Transfer",
    reference_id: `ref_${Date.now()}`, // Unique reference ID
  };

  try {
    // const response = await axios.post(
    //   "https://api.razorpay.com/v1/payouts",
    //   data,
    //   {
    //     headers: {
    //       Authorization: `Basic ${razorpayAuth}`,
    //       "Content-Type": "application/json",
    //     },
    //   }
    // );

    const user = await User.findOne({ userId });

    user.balance -= amount;
    await user.save();

    res.status(200).json({
      message: "Payout created successfully",
      payout: amount,
    });
  } catch (error) {
    console.error("Error creating payout:", error.response.data);
    res.status(500).json({
      error: error.response.data || "Failed to create payout",
    });
  }
};