const validateLoginData = (req, res, next) => {
    const { phoneOrEmail, password } = req.body;

    if (!phoneOrEmail || !password) {
        return res.status(400).json({
            error: 'Missing fields',
            message: 'Phone or email and password are required.'
        });
    }
    next(); // Proceed to the next step (controller)
};

module.exports = { validateLoginData };
