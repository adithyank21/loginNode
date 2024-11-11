const User = require("../models/userModel");
const { generateOtp } = require("../middleware/otpService"); // Ensure OTP is correctly generated
const bcrypt = require("bcryptjs");  // For password hashing
const { validateEmail, validatePhone, validatePassword } = require("../middleware/validation");

exports.signup = async (req, res) => {
    const { username, phoneOrEmail, password, confirmPassword, role } = req.body;

    try {
        // Track missing fields
        const missingFields = [];
        if (!username) missingFields.push("username");
        if (!phoneOrEmail) missingFields.push("phoneOrEmail");
        if (!password) missingFields.push("password");
        if (!confirmPassword) missingFields.push("confirmPassword");

        // If any required fields are missing, return an error with details
        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Missing required fields: ${missingFields.join(", ")}`,
                message: `The following fields are required: username, phoneOrEmail, password, confirmPassword.`
            });
        }

        // Validate email or phone format
        // Add any validation logic for email or phone
        if (validateEmail(phoneOrEmail) || validatePhone(phoneOrEmail)) {
            // Check if passwords match
            if (password !== confirmPassword) {
                return res.status(400).json({ error: "Passwords do not match", message: "Ensure both password fields are the same." });
            }

            // Check if user already exists
            const existingUser = await User.findOne({ phoneOrEmail });
            if (existingUser) {
                return res.status(400).json({ error: "User already exists with this phone/email", message: "An account with this phone or email already exists. Please try with a different one." });
            }

            // Hash the password before storing it
            const hashedPassword = await bcrypt.hash(password, 10);

            // Generate OTP
            const otp = generateOtp();
            console.log(`Generated OTP: ${otp}`);

            // Save the user with OTP and mark them as unverified
            const user = new User({
                username,
                phoneOrEmail,
                password: hashedPassword, // Save hashed password
                role: role || "customer", // Defaults to "customer" if no role provided
                otp,
                otpExpiry: new Date(Date.now() + 10 * 60 * 1000), // OTP expires in 10 minutes
                isVerified: false  // User is not verified yet
            });

            await user.save();
            res.status(200).json({ message: "OTP sent, please verify to complete registration" });
        } else {
            res.status(400).json({ error: "Invalid email or phone number", message: "Please provide a valid email or phone number." });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating user", message: "An error occurred while processing your request. Please try again later." });
    }
};
