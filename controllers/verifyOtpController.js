const User = require("../models/userModel");
const { generateOtp } = require("../services/otpService");

exports.verifyOtp = async (req, res) => {
    const { phoneOrEmail, otp } = req.body;

    try {
        // Check if phone/email and OTP are provided
        if (!phoneOrEmail || !otp) {
            return res.status(400).json({ error: "Phone/email and OTP are required" });
        }

        // Find the user by phone or email
        const user = await User.findOne({ phoneOrEmail });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if OTP is valid and hasn't expired
        if (user.otp && user.otpExpiry > Date.now()) {
            if (user.otp === otp) {
                // OTP is valid, clear OTP and expiry from the user document
                user.otp = undefined;
                user.otpExpiry = undefined;

                // Mark the user as verified
                user.isVerified = true;  // Mark as verified after OTP verification

                await user.save();
                res.status(200).json({ message: "OTP verified, registration complete" });
            } else {
                res.status(400).json({
                    error: "Invalid OTP",
                    message: "Please enter the correct OTP."
                });
            }
        } else {
            res.status(400).json({
                error: "OTP expired, please retry",
                message: "The OTP has expired. Please request a new OTP."
            });
        }
    } catch (error) {
        console.error("Error verifying OTP: ", error);
        res.status(500).json({
            error: "Error verifying OTP",
            message: `An error occurred while verifying the OTP: ${error.message}`
        });
    }
};
