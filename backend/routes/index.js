const express = require("express");
const userRouter = require('./user');

const accountRouter = require("./account");
const transactionRouter = require('./transactions'); 
const router = express.Router();

router.use('/user',userRouter);
router.use('/account',accountRouter);
router.use('/transactions', transactionRouter);

module.exports = router;
