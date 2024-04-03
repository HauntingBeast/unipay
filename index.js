const connectDB=require('./db/connect')
const express = require('express');
const cors = require("cors");
const notFound=require('./middleware/not-found')
const errorHandlerMiddleware=require('./middleware/error-handler')
const app=express()
const router=require('./routes/unipay')
require('dotenv').config()
require('express-async-errors')

//middleware
app.use(cors())
app.use(express.json())

//routes
app.use('/api/v1/',router)   
app.use(notFound);
app.use(errorHandlerMiddleware)
const port= process.env.PORT || 3000

const start= async()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port,console.log(`Server is listening to ${port}... `))
    } catch (error) {
        console.log(error)
    }
}
start() 
