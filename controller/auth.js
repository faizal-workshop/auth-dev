const { APP_NAME, JWT_EXPIRATION } = require('../src/configs');
const model = require('../model/auth');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const fs = require('fs');
const path = require('path');
const keyFolderPath = path.join(__dirname, '..', '.keys');

async function getJwtSecret() {
    const keyPath = path.join(keyFolderPath, 'private.pem');
    const jwtSecret = fs.readFileSync(keyPath, 'utf8');

    return jwtSecret;
}

module.exports = {
    registerEmail: async (req, res) => {
        const schema = Joi.object({
            name: Joi.string().max(30).messages({
                'string.max': 'Name must be less than or equal to 30 characters long!',
            }),
            email: Joi.string().email().required().messages({
                'string.email': 'Please provide a valid email address!',
                'any.required': 'Email is required!',
                'string.empty': 'Email is required!',
            }),
            password: Joi.string().min(8).required().messages({
                'string.min': 'Password must be at least 8 characters long!',
                'any.required': 'Password is required!',
                'string.empty': 'Password is required!',
            }),
        });
        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).send({
                application: APP_NAME,
                message: error.details[0].message,
            });
        }

        const { name = '', email = '', password = '' } = req.body || {};

        try {
            const userData = { name, email, password };
            const result = await model.registerEmail(userData);

            return res.status(201).send({
                application: APP_NAME,
                message: 'New user account registered successfully.',
                data: {
                    id: result.id,
                    name: result.name,
                    email: result.email,
                    usertype: result.usertype,
                    createdAt: result.createdAt,
                },
            });
        } catch (e) {
            return res.status(401).send({
                application: APP_NAME,
                message: 'Register user account failed!',
            });
        }
    },
    loginEmail: async (req, res) => {
        const schema = Joi.object({
            email: Joi.string().email().required().messages({
                'string.email': 'Please provide a valid email address!',
                'any.required': 'Email is required!',
                'string.empty': 'Email is required!',
            }),
            password: Joi.string().min(8).required().messages({
                'string.min': 'Password must be at least 8 characters long!',
                'any.required': 'Password is required!',
                'string.empty': 'Password is required!',
            }),
        });
        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).send({
                application: APP_NAME,
                message: error.details[0].message,
            });
        }

        const { email = '', password = '' } = req.body || {};

        if (!email || !password) {
            return res.status(401).send({
                application: APP_NAME,
                message: 'Email and password should be provided!',
            });
        }

        try {
            const userData = { email, password };
            const result = await model.loginEmail(userData);
            const jwtSecret = await getJwtSecret();
            const token = jwt.sign({
                id: result.id,
                name: result.name,
                email: result.email,
                usertype: result.usertype,
            }, jwtSecret, { algorithm: 'RS256', expiresIn: JWT_EXPIRATION });

            return res.status(200).send({
                application: APP_NAME,
                message: 'Login with email success.',
                data: token,
            });
        } catch (e) {
            return res.status(401).send({
                application: APP_NAME,
                message: 'Login with email failed, please try again!',
            });
        }
    },
    checkToken: async (req, res) => {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).send({
                application: APP_NAME,
                message: 'Missing authentication token!',
            });
        }

        try {
            const jwtSecret = await getJwtSecret();
            const verify = jwt.verify(token, jwtSecret, { algorithms: ['RS256'] });
            const expirationTime = verify.exp;
            const currentTimeInSeconds = Math.floor(Date.now() / 1000);
            const remainingTimeInSeconds = expirationTime - currentTimeInSeconds;
            const remainingTime = {
                hours: Math.floor(remainingTimeInSeconds / 3600),
                minutes: Math.floor((remainingTimeInSeconds % 3600) / 60),
                seconds: remainingTimeInSeconds % 60,
            };

            return res.status(200).send({
                application: APP_NAME,
                message: 'Token is valid.',
                data: {
                    remainingTime,
                    payload: verify,
                    token,
                },
            });
        } catch (e) {
            return res.status(401).send({
                application: APP_NAME,
                message: 'Token is invalid!',
            });
        }
    },
    updateUser: async (req, res) => {
        const schema = Joi.object({
            name: Joi.string().max(30).messages({
                'string.max': 'Name must be less than or equal to 30 characters long!',
            }),
            email: Joi.string().email().messages({
                'string.email': 'Please provide a valid email address!',
            }),
            password: Joi.string().min(8).messages({
                'string.min': 'Password must be at least 8 characters long!',
            }),
        });
        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).send({
                application: APP_NAME,
                message: error.details[0].message,
            });
        }

        const userId = req.params.id;
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        const decoded = jwt.decode(token);
        const decodedId = decoded.id;
        const usertype = decoded.usertype;
        const issuedAt = decoded.iat;
        const { name = '', email = '', password = '' } = req.body || {};

        if (usertype !== 'administrator' && userId !== decodedId) {
            return res.status(403).send({
                application: APP_NAME,
                message: 'Invalid authentication token!',
            });
        }

        try {
            const userData = {};
            if (name) userData.name = name;
            if (email) userData.email = email;
            if (password) userData.password = password;

            const result = await model.updateUser(userId, userData);
            const jwtSecret = await getJwtSecret();
            const token = jwt.sign({
                id: result.id,
                name: result.name,
                email: result.email,
                usertype: result.usertype,
                iat: issuedAt
            }, jwtSecret, { algorithm: 'RS256', expiresIn: JWT_EXPIRATION });

            return res.status(200).send({
                application: APP_NAME,
                message: 'User account updated successfully.',
                data: token,
            });
        } catch (e) {
            return res.status(500).send({
                application: APP_NAME,
                message: 'Edit user account failed!',
            });
        }
    },
    deleteUser: async (req, res) => {
        const userId = req.params.id;
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        const decoded = jwt.decode(token);
        const decodedId = decoded.id;
        const usertype = decoded.usertype;

        if (usertype !== 'administrator' && userId !== decodedId) {
            return res.status(403).send({
                application: APP_NAME,
                message: 'Invalid authentication token!',
            });
        }

        try {
            const result = await model.deleteUser(userId);

            return res.status(200).send({
                application: APP_NAME,
                message: 'User account deleted successfully.',
            });
        } catch (e) {
            return res.status(500).send({
                application: APP_NAME,
                message: 'Delete user account failed!',
            });
        }
    },
}
