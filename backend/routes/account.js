const express = require("express");
const {authMiddleware} = require('../middleware');
const {Account,Transaction} = require('../db');
const router = express.Router();
const mongoose = require("mongoose");
const zod = require("zod");

//getting the respective user's balance
router.get("/balance",authMiddleware,async(req,res)=>{
   try {
     const account = await Account.findOne({
        userId:req.userId
    });

    res.json({
        balance:account.balance
    })
   } catch (error) {
    res.status(500).json({
        msg: "Error fetching balance",})
   }
});


//route to transfer money
router.post("/transfer",authMiddleware,async(req,res)=>{
    
     const session = await mongoose.startSession();

    try {
        
        session.startTransaction();

        const fromUserId =new  mongoose.Types.ObjectId(req.userId);
        const toUserId =  new mongoose.Types.ObjectId(req.body.to);
        const amount = Number  (req.body.amount);
        if (typeof amount !== "number" || amount <= 0) {
            await session.abortTransaction();
            return res.status(400).json({ msg: "Invalid transfer amount" });
        }

        const fromAccount = await Account.findOne({ userId: fromUserId }).session(session);
        if (!fromAccount || fromAccount.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ msg: "Insufficient Balance" });
        }

        const toAccount = await Account.findOne({ userId: toUserId }).session(session);
        if (!toAccount) {
            await session.abortTransaction();
            return res.status(400).json({ msg: "Invalid account" });
        }

         // Prevent self-transfer
        if (fromUserId.equals(toUserId)) {
            await session.abortTransaction();
            return res.status(400).json({ msg: "Cannot transfer to yourself" });
        }

        await Account.updateOne({ userId: fromUserId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: toUserId }, { $inc: { balance: amount } }).session(session);
        // Create transaction records
        const transactionRecords = {
            fromUserId,
            toUserId,
            amount,
            timestamp: new Date(),
            senderBalanceAfter: fromAccount.balance - amount,
            receiverBalanceAfter: toAccount.balance - amount
        };

        await Transaction.create(transactionRecords, { session, ordered: true });
        // Commit the transaction
        await session.commitTransaction();
        res.json({ msg: "Transfer successful" });
    } catch (err) {
        await session.abortTransaction();
        res.status(500).json({ msg: "Transfer failed", error: err.message });
    } finally {
        session.endSession();
    }
});


module.exports = router;