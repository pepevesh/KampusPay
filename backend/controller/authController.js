const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require("../model/User");
const dotenv = require('dotenv');
const { redisClient } = require('../config/redisdatabase');
const { comparePassword } = require('../utils/passwordUtils');

dotenv.config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

// Login function
const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId, password } = req.body;
        const person = await User.findOne({ userId });

        if (!person) {
            return res.status(401).json({ message: "Employee Does Not Exist" });
        }


        if (password !== person.password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        

        const user = {
            id: person._id,
            userId: person.userId,
            name: person.name,
            role: person.role,
            email: person.email,
            balance: person.balance,
            dailyLimit: person.dailyLimit,
            availability: person.availability,

        };

        const accessToken = jwt.sign(user, accessTokenSecret, { expiresIn: '15m' });

        let refreshToken;
        // Set refresh token as an HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ accessToken, user });
    } catch (error) {
        console.error("Error in login:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};


// Token validation function
const validateToken = (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({ message: 'No authorization header found' });

        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ message: 'No token provided' });

        jwt.verify(token, accessTokenSecret, (err, decoded) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ message: 'Token has expired' });
                }
                return res.status(403).json({ message: 'Invalid token' });
            }
            const user = {
                id: decoded.id,
                userId: decoded.userId,
                name: decoded.name,
                role: decoded.role,
                email: decoded.email,
                balance: decoded.balance,
                dailyLimit: decoded.dailyLimit,
                availability: decoded.availability
            };
            res.status(200).json({ valid: true, user });
        });
    } catch (error) {
        console.error("Error in validateToken:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Logout function
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (refreshToken) {
            const user = jwt.verify(refreshToken, refreshTokenSecret);
            await redisClient.del(`refreshToken:${user.id}`);

            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            });

            res.json({ message: "Logout successful" });
        } else {
            res.status(400).json({ message: "No refresh token found" });
        }
    } catch (error) {
        console.error("Error in logout:", error.message);
        res.status(403).json({ message: "Invalid refresh token" });
    }
};

// Refresh access token function
const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        if (!refreshToken) return res.status(401).json({ message: "No refresh token" });

        const person = jwt.verify(refreshToken, refreshTokenSecret);
        const storedRefreshToken = await redisClient.get(`refreshToken:${user.id}`);

        if (refreshToken !== storedRefreshToken) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

            const user = {
            id: person._id,
            userId: person.userId,
            name: person.name,
            role: person.role,
            email: person.email,
            balance: person.balance,
            dailyLimit: person.dailyLimit,
            availability: person.availability,

        };
        const accessToken = jwt.sign(user, accessTokenSecret, { expiresIn: '15m' });

        res.json({ accessToken });
    } catch (error) {
        console.error("Error in refreshAccessToken:", error.message);
        res.status(403).json({ message: "Invalid refresh token" });
    }
};

module.exports = { login, logout, refreshAccessToken, validateToken };