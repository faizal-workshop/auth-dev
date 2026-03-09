import Joi from 'joi';

export default {
    login: (input) => {
        const schema = Joi.object({
            email: Joi.string().email({ tlds: { allow: false } }).required(),
            password: Joi.string().required(),
        });

        return schema.validate(input);
    },
    createData: (input) => {
        const schema = Joi.object({
            name: Joi.string().max(30).required(),
            email: Joi.string().email({ tlds: { allow: false } }).required(),
            password: Joi.string().min(12).max(180)
                .custom((value, helpers) => {
                    const hasUpperCase = /[A-Z]/.test(value);
                    const hasLowerCase = /[a-z]/.test(value);
                    const hasNumbers = /[0-9]/.test(value);
                    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

                    const count = [
                        hasUpperCase,
                        hasLowerCase,
                        hasNumbers,
                        hasSpecialChar
                    ].filter(Boolean).length;

                    if (count < 3) {
                        return helpers.message('The password must contain at least three of the following: uppercase letters, lowercase letters, numbers, and special characters.');
                    }

                    return value;
                })
                .messages({
                    'string.min': 'The allowed minimum password length is 12 characters.',
                    'string.max': 'The allowed maximum password length is 64 characters.',
                }).required(),
        });

        return schema.validate(input);
    },
    editData: (input) => {
        const schema = Joi.object({
            name: Joi.string().max(30).allow(null, '').optional(),
            email: Joi.string().email({ tlds: { allow: false } }).allow(null, '').optional(),
            password: Joi.string().min(12).max(180)
                .custom((value, helpers) => {
                    const hasUpperCase = /[A-Z]/.test(value);
                    const hasLowerCase = /[a-z]/.test(value);
                    const hasNumbers = /[0-9]/.test(value);
                    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

                    const count = [
                        hasUpperCase,
                        hasLowerCase,
                        hasNumbers,
                        hasSpecialChar
                    ].filter(Boolean).length;

                    if (count < 3) {
                        return helpers.message('The password must contain at least three of the following: uppercase letters, lowercase letters, numbers, and special characters.');
                    }

                    return value;
                })
                .messages({
                    'string.min': 'The allowed minimum password length is 12 characters.',
                    'string.max': 'The allowed maximum password length is 64 characters.',
                }).allow(null, '').optional(),
        });

        return schema.validate(input);
    },
}
