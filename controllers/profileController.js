const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.fillYourProfile = async (req, res) => {
    const { accessToken } = req.body;

    if (!accessToken) {
        return res.status(400).json({ error: "Access token required" });
    }

    try {
        // Verify the access token
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

        // Find the user using the decoded userId
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Proceed with profile update (assuming you want to update some fields)
        // For example, updating the profile data
        user.profileFilled = true; // or any other updates you want

        await user.save(); // Save the updated profile
        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: "Invalid or expired access token" });
    }
};
