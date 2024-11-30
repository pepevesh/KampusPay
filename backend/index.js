const express = require('express');
const mongoose = require('mongoose');

const app = express();

require('dotenv').config();

app.use(express.json());

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log('Connected to MongoDB KampusPay_Test');
        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });
    })
    .catch((err) => {
        console.log('Connection failed:', err.message);
   });