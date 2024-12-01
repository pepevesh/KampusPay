const express = require("express");
const router = express.Router();
const User = require('../model/User');
const {  decrypt } = require('../utils/encryptionUtils');

// exports.encryptqr= async (req, res) => {
//     const { userId } = req.body;
//     if (!userId) {
//       return res.status(400).json({ error: 'userId is required' });
//     }
  
//     try {
//       const encrypted = encrypt(userId);
//       await db.collection('users').insertOne({ encrypted });
//       res.status(200).json({ message: 'Encrypted and saved', encrypted });
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Failed to encrypt and save' });
//     }
//   };
exports.decryptqr= async (req, res) => {
    const { encryptedqr } = req.body;
  
    try {
      // const record = await db.collection('users').findOne({ _id: new MongoClient.ObjectID(id) });
      // if (!record) {
      //   return res.status(404).json({ error: 'Record not found' });
      // }
      const decrypted = decrypt(encryptedqr);
      res.status(200).json({ userId: decrypted });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to decrypt' });
    }
  };
