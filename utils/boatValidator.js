const { body, validationResult } = require('express-validator');

const boatValidationRules = () => {
    return [
        // ownerId must be a valid MongoDB ObjectId and is required
        body('ownerId')
            .isMongoId()
            .withMessage('ownerId must be a valid MongoDB ObjectId')
            .notEmpty()
            .withMessage('ownerId is required'),
        // name must be a string and is required
        body('name').isString().notEmpty().withMessage('name is required'),
        // type must be a string and is required
        body('type').isString().notEmpty().withMessage('type is required'),
        // description must be a string (optional)
        body('description').isString().optional(),
        // location must be a string (optional)
        body('location').isString().optional(),
        // pricePerDay must be a number and is required
        body('pricePerDay')
            .isNumeric()
            .withMessage('pricePerDay must be a number')
            .notEmpty()
            .withMessage('pricePerDay is required'),
        // features must be an array of strings (optional)
        body('features').isArray().withMessage('features must be an array').optional(),
        body('features.*')
            .isString()
            .withMessage('features must be an array of strings')
            .optional(),
        // amenities must be an array of strings (optional)
        body('amenities').isArray().withMessage('amenities must be an array').optional(),
        body('amenities.*')
            .isString()
            .withMessage('amenities must be an array of strings')
            .optional()
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
    boatValidationRules,
    validate
};


