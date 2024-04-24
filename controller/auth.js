const { APP_NAME, JWT_ACCESS_EXPIRATION, JWT_REFRESH_EXPIRATION } = require('../src/configs');
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

async function verifyJwt(token) {
    const jwtSecret = await getJwtSecret();
    const payload = jwt.verify(token, jwtSecret, {
        algorithms: ['RS256'],
    });

    return payload;
}

async function signJwt(payload, expiresIn) {
    const jwtSecret = await getJwtSecret();
    const token = jwt.sign(payload, jwtSecret, {
        algorithm: 'RS256',
        expiresIn,
    });

    return token;
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
            return await res.status(400).send({
                application: APP_NAME,
                message: error.details[0].message,
            });
        }

        const { name = '', email = '', password = '' } = req.body || {};

        try {
            const userData = { name, email, password };
            const result = await model.registerEmail(userData);

            return await res.status(201).send({
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
            return await res.status(401).send({
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
            remember: Joi.boolean(),
        });
        const { error } = schema.validate(req.body);

        if (error) {
            return await res.status(400).send({
                application: APP_NAME,
                message: error.details[0].message,
            });
        }

        const { email = '', password = '', remember = false } = req.body || {};

        if (!email || !password) {
            return await res.status(401).send({
                application: APP_NAME,
                message: 'Email and password should be provided!',
            });
        }

        try {
            const userData = { email, password };
            const result = await model.loginEmail(userData);

            if (remember) {
                const token = {
                    access_token: await signJwt({
                        id: result.id,
                        name: result.name,
                        email: result.email,
                        usertype: result.usertype,
                    }, JWT_ACCESS_EXPIRATION),
                    refresh_token: await signJwt({
                        id: result.id,
                        type: 'refresh',
                    }, JWT_REFRESH_EXPIRATION),
                }

                return await res.status(200).send({
                    application: APP_NAME,
                    message: 'Login with email success.',
                    data: token,
                });
            } else {
                const token = {
                    access_token: await signJwt({
                        id: result.id,
                        name: result.name,
                        email: result.email,
                        usertype: result.usertype,
                    }, JWT_ACCESS_EXPIRATION),
                }

                return await res.status(200).send({
                    application: APP_NAME,
                    message: 'Login with email success.',
                    data: token,
                });
            }
        } catch (e) {
            return await res.status(401).send({
                application: APP_NAME,
                message: 'Login with email failed, please try again!',
            });
        }
    },
    loginToken: async (req, res) => {
        const authHeader = req.headers.authorization;
        const refreshToken = authHeader && authHeader.split(' ')[1];

        if (!refreshToken) {
            return await res.status(401).send({
                application: APP_NAME,
                message: 'Refresh token should be provided!',
            });
        }

        try {
            const verify = await verifyJwt(refreshToken);

            if (verify.type !== 'refresh') {
                return await res.status(401).send({
                    application: APP_NAME,
                    message: 'Invalid refresh token!',
                });
            }

            const id = verify.id;
            const result = await model.loginToken(id);
            const token = {
                access_token: await signJwt({
                    id: result.id,
                    name: result.name,
                    email: result.email,
                    usertype: result.usertype,
                }, JWT_ACCESS_EXPIRATION),
            }

            return await res.status(200).send({
                application: APP_NAME,
                message: 'Refresh access token success.',
                data: token,
            });
        } catch (e) {
            return await res.status(401).send({
                application: APP_NAME,
                message: 'Refresh access token failed, please try again!',
            });
        }
    },
    checkToken: async (req, res) => {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return await res.status(401).send({
                application: APP_NAME,
                message: 'Missing authentication token!',
            });
        }

        try {
            const verify = await verifyJwt(token);
            const expirationTime = verify.exp;
            const currentTimeInSeconds = Math.floor(Date.now() / 1000);
            const remainingTimeInSeconds = expirationTime - currentTimeInSeconds;
            const remainingTime = {
                hours: Math.floor(remainingTimeInSeconds / 3600),
                minutes: Math.floor((remainingTimeInSeconds % 3600) / 60),
                seconds: remainingTimeInSeconds % 60,
            };

            return await res.status(200).send({
                application: APP_NAME,
                message: 'Token is valid.',
                data: {
                    remainingTime,
                    payload: verify,
                    token,
                },
            });
        } catch (e) {
            return await res.status(401).send({
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
            return await res.status(400).send({
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
            return await res.status(403).send({
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
            const token = {
                access_token: await signJwt({
                    id: result.id,
                    name: result.name,
                    email: result.email,
                    usertype: result.usertype,
                    iat: issuedAt
                }, JWT_ACCESS_EXPIRATION),
            }

            return await res.status(200).send({
                application: APP_NAME,
                message: 'User account updated successfully.',
                data: token,
            });
        } catch (e) {
            return await res.status(500).send({
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
            return await res.status(403).send({
                application: APP_NAME,
                message: 'Invalid authentication token!',
            });
        }

        try {
            const result = await model.deleteUser(userId);

            return await res.status(200).send({
                application: APP_NAME,
                message: 'User account deleted successfully.',
            });
        } catch (e) {
            return await res.status(500).send({
                application: APP_NAME,
                message: 'Delete user account failed!',
            });
        }
    },
}
