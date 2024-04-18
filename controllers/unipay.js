const zod = require("zod");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")
const { User, Account } = require("../models/unipay")

const signupBody = zod.object({
    username: zod.string().email(),
	firstName: zod.string(),
	lastName: zod.string(),
	password: zod.string()
})

const signinBody = zod.object({
    username: zod.string().email(),
	password: zod.string()
})

const updateBody = zod.object({
	password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

// const JWT_SECRET=process.env.JWT_SECRET


const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({});
    }
    console.log("auth")

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = decoded.userId;
        
        next();
    } catch (err) {
        return res.status(403).json({});
    }
}

const signup=async (req, res) => {
    // console.log(req.body);
    const { success } = signupBody.safeParse(req.body)
    // console.log(success)
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const existingUser = await User.findOne({
        username: req.body.username
    })

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    })
    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        userId
    },process.env.JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })
}

const testing= async(req,res)=>{
     res.status(200).json({msg :'succefull'})
}

const signin = async (req, res) => {
    const { success } = signinBody.safeParse(req.body)
    console.log(req.body)
    console.log(success)
    if (!success) {
        console.log("error")
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }
    
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });
    console.log(user)
    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, process.env.JWT_SECRET);
  
        res.json({
            token: token,
            user: user._id
        })
        return;
    }

    
    res.status(401).json({
        message: "Error while logging in"
    })
}

const update = async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne(req.body, {
        id: req.userId
    })

    res.json({
        message: "Updated successfully"
    })
}

const about=async (req, res) => {
    console.log("hello");
    const filter = req.query.filter || "";
    console.log(filter)

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
}

const balance=async (req, res) => {
    // console.log("aaya")
    const userId = req.query.userId;
    console.log(userId);
    const account = await Account.findOne({
        userId: userId
    });

    console.log(account);
    
    res.json({
        balance: account.balance
    })
}
const transfer=async (req, res) => {
    console.log("aaya")
    console.log(req.body);
    const session = await mongoose.startSession();
    
    session.startTransaction();
    const { amount, to, userId } = req.body;
    console.log(amount, to, userId);
    
    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: userId }).session(session);
    console.log(account)
    
    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }
    // const rem= account.balance-amount
    // console.log(rem)
    // Perform the transfer

    await Account.updateOne({ userId: userId }, { $inc: { balance:-amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
    // await session.commitTransaction();
    // await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
    

    // Commit the transaction
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
}
module.exports={testing,signup,signin,about,update,auth,balance,transfer}