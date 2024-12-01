const mongoose = require('mongoose');
const User = require('../model/User');
const webpush = require('web-push');

webpush.setVapidDetails(
    'mailto:farhan786bugati@gmail.com', // Replace with your email
    process.env.VAPID_PUBLIC_KEY, // VAPID Public Key (should be stored in env)
    process.env.VAPID_PRIVATE_KEY // VAPID Private Key (should be stored in env)
  );
  

//   const webpush = require('web-push');
//   const User = require('../model/User'); // Adjust path as needed
  
//   // Set VAPID keys (replace with your actual keys)
//   webpush.setVapidDetails(
//     'mailto:your-email@example.com',
//     process.env.VAPID_PUBLIC_KEY,
//     process.env.VAPID_PRIVATE_KEY
//   );
  
  exports.sendNotification = async (message, userId) => {
    try {
      // Validate input
      if (!userId || !message) {
        throw new Error('UserId and message are required.');
      }
  
      const user = await User.findById(userId);
  
      if (!user) {
        throw new Error('User not found.');
      }
  
      if (!user.notification || !user.notification.endpoint) {
        throw new Error('No valid notification subscription found.');
      }
  
      const subscription = user.notification; // Ensure this contains valid push notification data
  
      // Send push notification
      await webpush.sendNotification(subscription, JSON.stringify({
        title: 'Daily Limit Alert',
        body: message,
        icon: '/web-app-manifest-192x192.png', // Adjust the icon path if needed
      }));
  
      console.log(`Notification sent successfully to user ${userId}.`);
      return { success: true, message: 'Notification sent.' };
    } catch (error) {
      console.error(`Error sending notification to user ${userId}:`, error);
      return { success: false, error: error.message };
    }
  };
  

exports.subscribe = async (req, res) => {
    const { subscription, userId } = req.body;
  
    // Store the subscription in memory or your database

    const user = await User.findOne({ userId });

    user.notification = subscription;
    await user.save();

    res.status(201).json({ message: 'Subscription added.' });
};
  
// Route to unsubscribe from push notifications
exports.unsubscribe = async (req, res) => {
    const { userId } = req.body;

    const user = await User.findOne({ userId });

    // Remove the subscription from memory or your database
    user.notification = null;
    await user.save();
    res.status(200).json({ message: 'Unsubscribed.' });
};
  

// exports.sendNotification = async (message, userId) => {
//     try {
//         // Validate input
//         if (!userId || !message) {
//             throw new Error('UserId and message are required.');
//         }

//         const user = await User.findOne({ userId });

//         if (!user) {
//             throw new Error('User not found.');
//         }

//         if (!user.notification) {
//             throw new Error('No subscribers found.');
//         }

//         const subscription = user.notification;

//         await webpush.sendNotification(subscription, JSON.stringify({
//             title: 'New Notification',
//             body: message,
//             icon: '/web-app-manifest-192x192.png',
//         }));

//         console.log('Notification sent successfully.');
//         return { success: true, message: 'Notification sent.' };
//     } catch (error) {
//         console.error('Error sending notification:', error);
//         return { success: false, error: error.message };
//     }
// };
