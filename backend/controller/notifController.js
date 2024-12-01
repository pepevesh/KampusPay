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
exports.sendNotification(message) = async (req, res) => {
    const { message, userId } = req.body;

    const user = await User.findOne({ userId });

    if (user.notification) {

        webpush.sendNotification(sub, JSON.stringify({
            title: 'New Notification',
            body: message,
            icon: '/web-app-manifest-192x192.png'
        })).catch(error => console.error('Error sending notification', error));

        res.status(200).json({ message: 'Notification sent.' });
    } else {
        res.status(404).json({ error: 'No subscribers found' });
    }
};