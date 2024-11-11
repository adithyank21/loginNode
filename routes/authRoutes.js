const express = require('express');
const { refreshAccessToken } = require('../controllers/authController');  // Ensure path is correct

const Authrouter = express.Router();

// Define routes
Authrouter.post('/refresh-access-token', refreshAccessToken); // Ensure refreshAccessToken is defined

module.exports = Authrouter;
