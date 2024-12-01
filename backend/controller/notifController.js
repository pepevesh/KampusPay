const mongoose = require('mongoose');
const User = require('../model/User');
const webpush = require('web-push');

webpush.setVapidDetails(
    'mailto:farhan786bugati@gmail.com', // Replace with your email
    process.env.VAPID_PUBLIC_KEY, // VAPID Public Key (should be stored in env)
    process.env.VAPID_PRIVATE_KEY // VAPID Private Key (should be stored in env)
  );
  

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
  
// Route to send a push notification
const webpush = require('web-push');
const User = require('../models/User'); // Adjust the path based on your project structure

exports.sendNotification = async (message, userId) => {
    try {
        // Validate input
        if (!userId || !message) {
            throw new Error('UserId and message are required.');
        }

        const user = await User.findOne({ userId });

        if (!user) {
            throw new Error('User not found.');
        }

        if (!user.notification) {
            throw new Error('No subscribers found.');
        }

        const subscription = user.notification;

        await webpush.sendNotification(subscription, JSON.stringify({
            title: 'New Notification',
            body: message,
            icon: '/web-app-manifest-192x192.png',
        }));

        console.log('Notification sent successfully.');
        return { success: true, message: 'Notification sent.' };
    } catch (error) {
        console.error('Error sending notification:', error);
        return { success: false, error: error.message };
    }
};
