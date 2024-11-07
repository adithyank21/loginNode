const express = require("express");
const { signup } = require("../controllers/signUpController"); 
const {verifyOtp}  = require("../controllers/verifyOtpController")
const router = express.Router();

router.post("/signup", signup);    
router.post("/verify-otp", verifyOtp); 

module.exports = router;
