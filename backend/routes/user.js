const express = require('express');
const router = express.Router();
const {User} = require("../db");
const {Account} = require("../db")
const zod = require("zod");
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../config")
const {authMiddleware} = require("../middleware");


//SignUp Route
const signupBody = zod.object({
    username:zod.string().email(),
    password:zod.string(),
    firstName:zod.string(),
    lastName:zod.string()
});

router.post("/signup", async (req,res)=>{
    console.log("hi there");
    const{ success } = signupBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            msg : "Email already taken / Incorrect inputs"
        })
    }
    
    const existingUser = await User.findOne({
        username:req.body.username
    })
    if(existingUser){
        return res.status(411).json({
            msg : "Email already taken / Incorrect inputs"
        })
    }
    const user = await User.create({
        username:req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });

    //----Create new Account----
     const userId = user._id;

    await Account.create({
        userId,
        balance:1 + Math.random()*10000
    })
    
   
    const token = jwt.sign({userId},JWT_SECRET);

    res.json({
        msg:"User created sucessfully",
        token:token
    })
});

//SignIn Route
const signinBody =zod.object({
    username:zod.string().email(),
    password:zod.string()
})
router.post("/signin",async (req,res)=>{
    const {success} = signinBody.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            msg:"Incorrect inputs"
        });
    }
    
    const user = await User.findOne({
        username:req.body.username
    })
    if(!user){
        return res.status(411).json({
            msg:"User not found"
        });
    }

    const isPasswordValid = await user.validatePassword(req.body.password);
    if(!isPasswordValid){
        return res.status(411).json({
            msg:"Invalid password"
        });
    }
    
    const token = jwt.sign({ userId:user._id },JWT_SECRET);

    res.json({
        msg: "Signin Succesful",
        token
    })
});

//Route to update user information
const updateBody = zod.object({
    password:zod.string(),
    firstname:zod.string(),
    lastName:zod.string()
});

router.put("/",authMiddleware,async (req,res)=>{
    const { success } = updateBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            msg: "Error while updating information"
        });
    }

    const user = await User.findOne(req.userId);
    if(!user){
        return res.status(404).json({
            msg: "User not found"
        });
    }

    // Update fields manually
    if(req.body.password){
        user.password = req.body.password;
    }
    if(req.body.firstName){
        user.firstName = req.body.firstName;
    }
    if(req.body.lastName){
        user.lastName = req.body.lastName;
    }

    await user.save();

    res.json({
        msg:"Updated successfully"
    });
});

//Route to get users from backend, filterable via firstName, lastName
router.get("/bulk",async (req,res)=>{
    const filter = req.query.filter||"";

    const user = await User.find({
        $or:[{
            firstName:{
                "$regex":filter,"$options": "i"
            }
        },{
            lastName:{
                "$regex":filter,"$options": "i"
            }
        }]
    })

    res.json({
        user:user.map(user=>({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
});

router.get("/me",authMiddleware,async (req,res)=>{
  try {
      const user = await User.findById(req.userId);
    if(!user){
        return res.status(404).json({
            msg: "User not found"
        });
    }
    res.json({
        user:{
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }
    });
  } catch (error) {
    res.status(500).json({
        msg: "Internal server error"
    });
  }
})

module.exports = router;