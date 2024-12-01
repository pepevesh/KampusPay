const Razorpay = require("razorpay");
const User = require('../model/User');
const Transaction = require('../model/Transaction');
const {redisClient} = require('../config/redisdatabase');
require('dotenv').config();

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Replace with your Razorpay Key ID
  key_secret: process.env.RAZORPAY_SECRET, // Replace with your Razorpay Key Secret
});

// Route to create a Razorpay order
exports.makePayment = async (req, res) => {
  const { userId, amount } = req.body;

  const options = {
    amount: amount*100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`, // Unique receipt ID
  };

  try {
    const order = await razorpay.orders.create(options);
    // const user = await User.findOne({ userId });
    await redisClient.set(order.id, userId,{EX:10*60});
    // const user = await User.findOne({ userId });

    // user.balance += amount;
    // await user.save();

    res.status(200).json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};

exports.webhook= async(req, res) => {
    try{    
        const {payload}= req.body;
        const orderid=payload.payment.entity.order_id;
        const amount=(payload.payment.entity.amount)/100;
        const userId =await redisClient.get(orderid);
        if(userId){
            console.log(payload);
            console.log(userId);
            const user = await User.findOne({ userId });
            console.log(amount);
            user.balance += amount;
            console.log(user.balance);
            // Create and save the transaction
            const transaction = new Transaction({
                sender: user,
                receiver: user,
                amount,
                category: "Wallet Top-up",
                date: new Date(),
            });
            user.transactions.push(transaction);
            await user.save();
            await transaction.save();
            redisClient.del(orderid);
        }
    }
    catch(error){
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ error: "Failed to create Razorpay order" });
    }
};
