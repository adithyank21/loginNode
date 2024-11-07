require('dotenv').config(); // Ensure environment variables are loaded
const express = require('express');
const mongoose = require('mongoose');
const signUpRoutes = require('./routes/signUpRoutes');
const loginRoutes = require('./routes/loginRoutes');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Register routes
app.use("/", signUpRoutes);  // Signup route
app.use("/", loginRoutes);    // Login route

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
