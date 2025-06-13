const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { date } = require("zod");
const { MONGO_URI } = require("./config");
mongoose.connect(MONGO_URI);

//User Schema
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        trim:true,
        lowercase:true,
        minLength:3,
        maxLength:30
    },
    password:{
        type:String,
        required:true,
        minLength:6
    },
    firstName:{
        type:String,
        required:true,
        trim:true,
        maxLength:50
    },
    lastName:{
        type:String,
        required:true,
        trim:true,
        maxLength:50
    }

});

//Account Schema
const accountSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
});

//Password Hashing 
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const saltRounds = 10;
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});

userSchema.methods.validatePassword = async function (candidatePassword){
    return await bcrypt.compare(candidatePassword,this.password);
};

const transactionSchema = new mongoose.Schema({
    transactionId:{
        type:String,
        required:true,
        unique:true,
        default: () => 'TXN' + Date.now() + Math.random().toString(36).substring(2, 5).toUpperCase()
    },
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    timestamp:{
        type:Date,
        default:Date.now
    },
    senderBalanceAfter: {
        type:Number,
        required:true
    },
    receiverBalanceAfter:{
        type:Number,
        required:true
    }
});

transactionSchema.index({ fromUserId: 1, toUserId: 1, timestamp: -1 });

const User = mongoose.model('User',userSchema);
const Account = mongoose.model('Account',accountSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports ={
    User,
    Account,
    Transaction
};
