const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { JWT_SECRET } = process.env;

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

        // Create JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({
            message: "Login successful",
            token: token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Server error",
            message: "An error occurred while processing your request. Please try again later."
        });
    }
};
