const express = require('express');
const mongoose = require('mongoose');
const connectDB = require("./config/mbdatabase");
const cors=require('cors');
const {hashPassword} = require('./utils/passwordUtils');
const cookieParser = require('cookie-parser');
const User = require('./model/User');
const {connectRedis} = require("./config/redisdatabase");

const app = express();
require('dotenv').config();
app.use(express.json());
const bodyParser = require("body-parser");

app.use(cors({origin:"http://localhost:3000", credentials:true}));
app.use(bodyParser.json());
app.use(cookieParser());
connectDB();
connectRedis();


app.use('/api/auth',require('./routes/auth'));
app.use('/api/user',require('./routes/userRoutes'));
app.use('/api/coupon',require('./routes/couponRoutes'));
app.use('/api/transaction',require('./routes/transactionRoutes'));

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB KampusPay_Test');
        app.listen(4000, () => {
            console.log("Server running on port 4000");
        });
    })
    .catch((err) => {
        console.log('Connection failed:', err.message);
    });