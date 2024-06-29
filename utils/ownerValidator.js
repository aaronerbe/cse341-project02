const { body, validationResult } = require('express-validator');

const ownerValidationRules = () => {
    return [
        // firstname must be a string and is required
        body('firstName').isString().notEmpty().withMessage('firstName is required'),
        // lastname must be a string and is required
        body('lastName').isString().notEmpty().withMessage('lastName is required'),
        // email must be an email and is required
        body('email')
            .notEmpty()
            .withMessage('email is required')
            .bail()
            .isEmail()
            .withMessage('Invalid email format'),
        body('password')
            .isString()
            .withMessage('Password must be a string')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters long')
            .matches(/[A-Z]/)
            .withMessage('Password must contain at least one uppercase letter')
            .matches(/[a-z]/)
            .withMessage('Password must contain at least one lowercase letter')
            .matches(/[!@#$%^&*(),.?":{}|<>]/)
            .withMessage('Password must contain at least one symbol')
    ];
};

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push(err.msg));

    return res.status(422).json({
        errors: extractedErrors
    });
};

module.exports = {
    ownerValidationRules,
    validate
};
