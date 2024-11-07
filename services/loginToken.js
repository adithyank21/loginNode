const jwt = require('jsonwebtoken');

// Function to generate JWT token
const generateToken = (user) => {
    const payload = {
        userId: user._id,
        username: user.username,
        phoneOrEmail: user.phoneOrEmail
    };

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { generateToken };
