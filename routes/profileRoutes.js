const express = require('express');
const { fillYourProfile } = require('../controllers/profileController'); // Correct path

const profileRouter = express.Router();

profileRouter.post('/fill-your-profile', fillYourProfile);

module.exports = profileRouter;
