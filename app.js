require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const signUpRoutes = require('./routes/signUpRoutes');
const loginRoutes = require('./routes/loginRoutes');
const authRoutes = require('./routes/authRoutes');  // Make sure the path is correct
const profileRoutes = require('./routes/profileRoutes')
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Register routes with prefixes
app.use("/", signUpRoutes);  // Signup route
app.use("/", loginRoutes);    // Login route
app.use("/", authRoutes);      // Auth routes (including refresh-token, logout, etc.)
app.use("/",profileRoutes)
// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
}).catch((error) => {
    console.log("Database connection error:", error);
});
