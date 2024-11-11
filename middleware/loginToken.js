const jwt = require('jsonwebtoken');

// Function to generate JWT access token
const generateAccessToken = (user) => {
    const payload = {
        userId: user._id,
        username: user.username,
        phoneOrEmail: user.phoneOrEmail
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Function to generate JWT refresh token
const generateRefreshToken = (user) => {
    const payload = { userId: user._id };
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });  // Use process.env.REFRESH_TOKEN_SECRET
};

module.exports = { generateAccessToken, generateRefreshToken };
