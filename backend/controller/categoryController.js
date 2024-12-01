const mongoose = require('mongoose');
const Transaction = require('../model/Transaction');

const getCategoryWiseTransactions = async (req, res) => {
    const { userId } = req.params;
    console.log(userId);

    try {
        const categorySplit = await Transaction.aggregate([
            {
                $match: {

                    sender: new mongoose.Types.ObjectId(userId) ,
                    category: { $ne: "Wallet Top-up" }, // Exclude wallet top-ups

                }
            },
            {
                // Project new field 'normalizedCategory'
                $project: {
                    sender: 1,
                    amount: 1,
                    category: {
                        $cond: {
                            if: { $in: ["$category", ["canteen", "stationery", "recreation", "events"]] }, 
                            then: "$category",
                            else: "others"
                        }
                    }
                }
            },
            {
               
                $group: {
                    _id: '$category',
                    totalAmount: {
                        $sum: {
                            $cond: [
                                { $eq: ['$sender', new mongoose.Types.ObjectId(userId)] },
                                { $multiply: [-1, '$amount'] }, // Deduct if sender
                                '$amount' // Add if receiver
                            ]
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { totalAmount: -1 }
            }
        ]);

        res.status(200).json(categorySplit);
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
};

module.exports = { getCategoryWiseTransactions };
