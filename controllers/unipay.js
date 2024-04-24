const zod = require("zod");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const qrcode = require('qrcode');
const { User, Account, Transaction } = require("../models/unipay")

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

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(403).json({});
    }
}

const signup = async (req, res) => {
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
    }, process.env.JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })
}

const testing = async (req, res) => {
    res.status(200).json({ msg: 'succefull' })
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
    try {
        // Validate the request body against the schema
        const { success } = updateBody.safeParse(req.body);
        if (!success) {
            return res.status(411).json({ message: "Error while updating information" });
        }

        // Find the user document in the database
        let userToUpdate = await User.findById(req.userId);
        if (!userToUpdate) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields if they're provided in the request body
        const { username, password, firstName, lastName } = req.body;
        if (username) userToUpdate.username = username;
        if (password) userToUpdate.password = password;
        if (firstName) userToUpdate.firstName = firstName;
        if (lastName) userToUpdate.lastName = lastName;

        // Save the updated user document
        await userToUpdate.save();

        res.json({ message: "Updated successfully", user: userToUpdate });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(400).json({ message: 'Invalid user data', error });
    }
};

// const listOfUsers=async (req, res) => {
//     console.log("hello");
//     const filter = req.query.filter || "";
//     console.log(filter)

//     const users = await User.find({
//         $or: [{
//             firstName: {
//                 "$regex": filter
//             }
//         }, {
//             lastName: {
//                 "$regex": filter
//             }
//         }]
//     })

//     res.json({
//         user: users.map(user => ({
//             username: user.username,
//             firstName: user.firstName,
//             lastName: user.lastName,
//             _id: user._id
//         }))
//     })
// }

const listOfUsers = async (req, res) => {
    // console.log("hello");
    const filter = req.query.filter || "";
    const userId = req.query.userId || ""; // Get the user ID from query params
    // console.log(filter, userId);

    const users = await User.find({
        $and: [ // Using $and to combine conditions
            {
                $or: [
                    { firstName: { "$regex": filter } },
                    { lastName: { "$regex": filter } }
                ]
            },
            { _id: { $ne: userId } } // Exclude the user with the provided user ID
        ]
    });

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    });
};


const about = async (req, res) => {
    const filter = req.params.userId;
    // console.log(filter);
    // if(filter==null)
    // return res.status(500).json({ error: "User id not found" });

    // console.log(filter);

    try {
        const user = await User.findById(filter);
        // console.log(user)
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            user: {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const balance = async (req, res) => {
    // console.log("aaya")
    const userId = req.query.userId;
    const account = await Account.findOne({
        userId: userId
    });

    res.json({
        balance: account.balance
    })
}
// const transfer=async (req, res) => {
//     console.log("aaya")
//     console.log(req.body);
//     const session = await mongoose.startSession();

//     session.startTransaction();
//     const { amount, to, userId } = req.body;
//     console.log(amount, to, userId);

//     // Fetch the accounts within the transaction
//     const account = await Account.findOne({ userId: userId }).session(session);
//     console.log(account)

//     if (!account || account.balance < amount) {
//         await session.abortTransaction();
//         return res.status(400).json({
//             message: "Insufficient balance"
//         });
//     }

//     const toAccount = await Account.findOne({ userId: to }).session(session);

//     if (!toAccount) {
//         await session.abortTransaction();
//         return res.status(400).json({
//             message: "Invalid account"
//         });
//     }
//     // const rem= account.balance-amount
//     // console.log(rem)
//     // Perform the transfer

//     await Account.updateOne({ userId: userId }, { $inc: { balance:-amount } }).session(session);
//     await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
//     // await session.commitTransaction();
//     // await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);


//     // Commit the transaction
//     await session.commitTransaction();
//     res.json({
//         message: "Transfer successful"
//     });
// }
// const transfer = require('./models/Transaction'); // Import the Transaction model

const transfer = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const { amount, to, password } = req.body;
    // console.log('====================================');
    // console.log(req.userId);
    // console.log('====================================');
    try {
        // Fetch the accounts within the transaction
        const userSendingMoney = await User.findById(req.userId);
        if (password != userSendingMoney.password) {
            return res.status(200).json({
                message: "Wrong Password"
            });
        }
        const account = await Account.findOne({ userId: req.userId }).session(session);
        if (amount <= 0) {
            await session.abortTransaction();
            return res.status(200).json({
                message: "Invalid Amount"
            });
        }
        if (account.balance < amount) {
            await session.abortTransaction();
            return res.status(200).json({
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

        // Perform the transfer
        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        // Create a transaction record
        const transaction = new Transaction({
            sender: req.userId,
            receiver: to,
            amount: amount
        });

        // Save the transaction
        await transaction.save({ session: session });

        // Commit the transaction
        await session.commitTransaction();
        res.json({
            message: "Transfer successful"
        });
    } catch (error) {
        console.error("Error transferring funds:", error);
        await session.abortTransaction();
        res.status(500).json({
            message: "Internal server error"
        });
    } finally {
        session.endSession();
    }
};

// Lord Kedia ka code
const transactions = async (req, res) => {
    const userId = req.params.userId || "";
    if (!userId) {
        return res.status(400).json({ error: "Unauthorized, Please Sign in" });
    }
    try {
        const userTransactions = await Transaction.find({
            $or: [
                { sender: userId },
                { receiver: userId }
            ]
        }).populate([
            { path: 'sender', select: 'firstName lastName' },
            { path: 'receiver', select: 'firstName lastName' }
        ]);

        res.json({
            transactions: userTransactions.map(transaction => ({
                sender: `${transaction.sender.firstName} ${transaction.sender.lastName}`,
                receiver: `${transaction.receiver.firstName} ${transaction.receiver.lastName}`,
                amount: transaction.amount,
                timestamp: transaction.timestamp
            }))
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const generateQRCode = async (req, res) => {
    const dat = req.params.userId;
    console.log(dat);
    const stringData = JSON.stringify(dat);

    try {
        qrcode.toDataURL(stringData, (err, code) => {
            if (err) {
                console.error("Error generating QR code:", err);
                return res.status(500).send("Error generating QR code");
            } else {
                return res.send(code); // Send the QR code as the response
            }
        });
    } catch (error) {
        console.error("Error generating QR code:", error);
        return res.status(500).send("Error generating QR code");
    }
};

module.exports = generateQRCode;

module.exports = { testing, signup, signin, listOfUsers, update, auth, balance, transfer, about, transactions, generateQRCode }