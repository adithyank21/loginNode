const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { generateAccessToken } = require('../middleware/loginToken');

// refreshAccessToken function
exports.refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ error: "Refresh token required" });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Find the user using the decoded userId from the refresh token
        const user = await User.findById(decoded.userId);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ error: "Invalid refresh token" });
        }

        // Generate new access token
        const newAccessToken = generateAccessToken(user);
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        console.error(error);
        res.status(403).json({ error: "Invalid refresh token" });
    }
};

// logout function (example, you might already have your own)
exports.logout = (req, res) => {
    // Implement logout logic, e.g., clearing refresh token, etc.
    res.send("Logged out successfully");
};
