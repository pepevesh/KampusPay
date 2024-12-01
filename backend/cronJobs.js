const cron = require('node-cron');
const mongoose = require('mongoose');
const User = require('./model/User'); // Adjust path to your User model
const Transaction = require('./model/Transaction'); // Adjust path to your Transaction model
const { sendNotification } = require('./controller/notifController'); // Import your function

// Cron job scheduled to run every 5 minutes
cron.schedule('*/2 * * * *', async () => {
  try {
    console.log('Running cron job to check user balance thresholds...');

    // Fetch all users
    const users = await User.find();

    for (const user of users) {
      // Fetch today's transactions for the user
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of the day in IST (local time)
    const offset = today.getTimezoneOffset() * 60000; // Get timezone offset in milliseconds
    const todayInUTC = new Date(today.getTime() - offset); // Convert to UTC

    // Start of tomorrow in UTC
    const tomorrow = new Date(todayInUTC);
    tomorrow.setDate(tomorrow.getDate() + 1);

      const transactions = await Transaction.aggregate([
        { $match: { userId: user._id, category: { $ne: "Wallet Top-up" }, date: { $gte: today, $lt: tomorrow } } },
        { $group: { _id: null, totalSpent: { $sum: "$amount" } } }
      ]);

      const totalSpent = transactions.length > 0 ? transactions[0].totalSpent : 0;
      const dailyLimit = user.dailyLimit;

      // Calculate thresholds
      const fiftyPercentThreshold = dailyLimit * 0.5;
      const ninetyPercentThreshold = dailyLimit * 0.9;

      // Send notifications based on thresholds
      if (totalSpent >= fiftyPercentThreshold && totalSpent < ninetyPercentThreshold) {
        await sendNotification('You have spent over 50% of your daily limit.', user.userId);
      } else if (totalSpent >= ninetyPercentThreshold) {
        await sendNotification('Alert! You have spent over 90% of your daily limit.', user.userId);
      }
    }
  } catch (error) {
    console.error('Error running cron job:', error);
  }
});
