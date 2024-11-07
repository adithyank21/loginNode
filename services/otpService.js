const crypto = require("crypto");

const generateOtp = () => {
    return crypto.randomInt(100000, 999999).toString();
};

const isOtpValid = (storedOtp, providedOtp) => {
    return storedOtp === providedOtp;
};

module.exports = { generateOtp, isOtpValid };
