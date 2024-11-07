const express = require('express');
const { login } = require('../controllers/loginController');
const { validateLoginData } = require('../middleware/validateLogin');

const loginrouter = express.Router();

// POST login route
loginrouter.post('/login', validateLoginData, (req, res, next) => {
    console.log("Login route accessed"); // Debugging line
    next();
}, login);

module.exports = loginrouter;
