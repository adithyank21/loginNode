const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const validatePhone = (phone) => {
    const re = /^[0-9]{10}$/;
    return re.test(phone);
};

const validatePassword = (password) => {
    return password.length >= 8; // Ensure password is at least 8 characters
};

module.exports = { validateEmail, validatePhone, validatePassword };
