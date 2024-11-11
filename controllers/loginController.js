const bcrypt = require('bcrypt');  // Add this line to import bcrypt
const User = require('../models/userModel');  // Ensure the path is correct
const { generateAccessToken, generateRefreshToken } = require('../middleware/loginToken');

exports.login = async (req, res) => {
    const { phoneOrEmail, password } = req.body;

    if (!phoneOrEmail || !password) {
        return res.status(400).json({
            error: 'Missing fields',
            message: 'Phone or email and password are required.'
        });
    }

    try {
        // Find user by phone or email
        const user = await User.findOne({ phoneOrEmail });

        if (!user) {
            return res.status(404).json({
                error: "User not found",
                message: "No account found with this phone/email."
            });
        }

        // Check if the user is verified
        if (!user.isVerified) {
            return res.status(400).json({
                error: "Account not verified",
                message: "Please verify your account via OTP before logging in."
            });
        }

        // Compare the password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                error: "Invalid password",
                message: "The password you entered is incorrect."
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Store the refresh token in the database (optional)
        user.refreshToken = refreshToken;

        try {
            await user.save(); // Save the refresh token to the database
            console.log("Generated refresh token:", refreshToken);
        } catch (saveError) {
            console.error("Error saving refresh token:", saveError);
            return res.status(500).json({
                error: "Server error",
                message: "An error occurred while saving the refresh token. Please try again later."
            });
        }

        res.status(200).json({
            message: "Login successful",
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Server error",
            message: "An error occurred while processing your request. Please try again later."
        });
    }
};
