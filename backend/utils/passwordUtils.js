const bcrypt = require('bcrypt');
const saltRounds = 12;

const hashPassword = async (password) => {
    try {
        if (!password || typeof password !== 'string') {
            throw new Error("Password must be a non-empty string");
        }

        const saltRounds = 10;  // Define salt rounds here
        const salt = await bcrypt.genSalt(saltRounds);  // Generate salt
        const hashedPassword = await bcrypt.hash(password, salt);  // Hash the password
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password: ' + error.message);  // Include detailed error
    }
};


async function comparePassword(password, hashedPassword) {
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        throw new Error('Error comparing password');
    }
}

module.exports = {
    hashPassword,
    comparePassword
};
