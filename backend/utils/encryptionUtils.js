const crypto = require('crypto');
require('dotenv').config();

// Load and validate encryption key
const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8'); // Key (32 bytes)

if (ENCRYPTION_KEY.length !== 32) {
  throw new Error('Invalid ENCRYPTION_KEY length. Key must be exactly 32 bytes.');
}

// Encrypt a userId
const encrypt = (userId) => {
  try {
    const cipher = crypto.createCipheriv('aes-256-ecb', ENCRYPTION_KEY, null); // ECB mode doesn't use IV
    let encrypted = cipher.update(userId, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  } catch (error) {
    console.error('Encryption Error:', error.message);
    throw error;
  }
};

// Decrypt the stored string back to userId
const decrypt = (encryptedData) => {
  try {
    const decipher = crypto.createDecipheriv('aes-256-ecb', ENCRYPTION_KEY, null); // ECB mode doesn't use IV
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption Error:', error.message);
    throw error;
  }
};

module.exports = { encrypt, decrypt };
