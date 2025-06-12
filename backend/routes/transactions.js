const express = require('express');
const mongoose = require('mongoose');
const { Transaction } = require('../db');
const { authMiddleware } = require('../middleware');
const router = express.Router();



router.get('/', authMiddleware, async (req, res) => {
try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const pipeline = [
        {
            $match: {
                fromUserId: userId
            }
        },

        {
            $lookup: {
                from: 'users',
                localField: 'fromUserId',
                foreignField: '_id',
                as: 'fromUser'
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'toUserId',
                foreignField: '_id',
                as: 'toUser'
            }
        },
        {
            $addFields: {
                isSender: { $eq: ['$fromUserId', userId] },
                balanceAfterTransaction: '$balanceAfterTransaction'
            }
        },
        {
            $sort: {
                timestamp: -1
            }
        }
    ];

    const transactions = await Transaction.aggregate(pipeline);

    // Format the transactions for frontend
    
    const formattedTransactions = transactions.map(transaction => {
        const isSender = transaction.isSender;
        const fromUser = transaction.fromUser[0];
        const toUser = transaction.toUser[0];
        const balanceAfterTransaction = transaction.balanceAfterTransaction;
        
        const counterparty = isSender ? 
                `${toUser?.firstName || 'Unknown'} ${toUser?.lastName || 'User'}` :
                `${fromUser?.firstName || 'Unknown'} ${fromUser?.lastName || 'User'}`;
       
        const userTransactionType = isSender ? 'debit' : 'credit';

        return {
            _id: transaction._id,
            transactionId: transaction.transactionId,
            amount: transaction.amount,
            type: userTransactionType,
            timestamp: transaction.timestamp,
            counterparty,
            balanceAfterTransaction
        }
    });

    res.json({
        success: true,
        data: formattedTransactions
    });


} catch (error) {
    console.error('Error searching transactions:', error);
        res.status(500).json({
            success: false,
            message: "Failed to search transactions"
        });
}
});

router.get('/search', authMiddleware, async (req, res) => {
    try{
        const userId = new mongoose.Types.ObjectId(req.userId);
        const { query } = req.query;

        if(!query || query.trim().length < 1) {
            return res.status(400).json({
                success: false,
                msg: "Search query required"
            });
        }

        const searchRegex = new RegExp(query.trim(), 'i');

        const pipeline = [
            //Match transactions where user is sender or receiver
            {
            $match: {
                fromUserId: userId
            }
        },
            // Join with users collection for sender details
            {
                $lookup: {
                    from: 'users',
                    localField: 'fromUserId',
                    foreignField: '_id',
                    as: 'fromUser'
                }
            },
            // Join with users collection for receivers details
            {
                $lookup: {
                     from: 'users',
                    localField: 'toUserId',
                    foreignField: '_id',
                    as: 'toUser'
                }
            },
            // Add computed fields to determine if user is sender 
            {
                $addFields: {
                    isSender: { $eq: ['$fromUserId', userId] },
                    balanceAfterTransaction: '$balanceAfterTransaction'
                }
            },
            // Filter based on counterparty's firstName or lastName
            {
                $match: {
                    $or: [
                        // If user is sender, search in receiver's name
                        {
                            $and: [
                                { isSender: true },
                                {
                                    $or: [
                                        { 'toUser.firstName': searchRegex },
                                        { 'toUser.lastName': searchRegex }
                                    ]
                                } 
                            ]
                        },
                        // If user is receiver, search in sender's name
                        {
                            $and: [
                                { isSender: false},
                                {
                                    $or: [
                                        { 'fromUser.firstName': searchRegex },
                                        { 'fromUser.lastName': searchRegex }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            },
            // Sort by latest transactions first
            {
                $sort: { timestamp: -1 }
            }
        ];

        const transactions = await Transaction.aggregate(pipeline);

        //Format transactions for frontend
        const formattedTransactions = transactions.map(transaction => {
            const isSender = transaction.isSender;
            const fromUser = transaction.fromUser[0];
            const toUser = transaction.toUser[0];
            const balanceAfterTransaction = transaction.balanceAfterTransaction;

            const counterparty = isSender ? 
                `${toUser?.firstName || 'Unknown'} ${toUser?.lastName || 'User'}` :
                `${fromUser?.firstName || 'Unknown'} ${fromUser?.lastName || 'User'}`;

            const userTransactionType = isSender ? 'debit' : 'credit';

            return {
            _id: transaction._id,
            transactionId: transaction.transactionId,
            amount: transaction.amount,
            type: userTransactionType,
            timestamp: transaction.timestamp,
            counterparty,
            balanceAfterTransaction
            };
        });

        res.json({
            success: true,
            data: formattedTransactions,
            searchQuery: query
        })
    } catch (error) {
        console.error('Error searching transactions:', error);
        res.status(500).json({
            success: false,
            message: "Failed to search transactions"
        });
    }
});

module.exports = router;