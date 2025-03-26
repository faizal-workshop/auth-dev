import {
    APP_NAME,
    JWT_ACCESS_EXPIRATION,
} from '../../source/configs.js';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import model from './model.js';
import validate from './validation.js';
import { validateToken } from '../../service/token.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const keyFolderPath = path.join(__dirname, '..', '..', '.keys');
const keyPath = path.join(keyFolderPath, 'private.pem');
const privateKey =
    fs.existsSync(keyPath) ? fs.readFileSync(keyPath, 'utf8') : null;

export default {
    login: async (req, res) => {
        const {
            email = '',
            password = '',
        } = req.body || {};

        const { error } = validate.login({ email, password } || {});

        if (error) {
            return res.status(400).send({
                application: APP_NAME,
                message: 'Invalid email or password, please try again!',
            });
        }

        try {
            const payload = await model.login({ email, password });

            const accessToken = jwt.sign(payload, privateKey, {
                header: { kid: 'auth-dev' },
                algorithm: 'RS256',
                expiresIn: JWT_ACCESS_EXPIRATION,
            });

            return res.status(200).send({
                application: APP_NAME,
                message: 'Login success.',
                data: accessToken,
            });
        } catch (e) {
            console.error(e);

            return res.status(500).send({
                application: APP_NAME,
                message: 'Login failed, please try again!',
            });
        }
    },
    checkToken: async (req, res) => {
        const bearer = req.headers.authorization;
        const verify = validateToken(bearer);

        try {
            const expirationTime = verify.exp;
            const currentTimeInSeconds = Math.floor(Date.now() / 1000);
            const remainingTimeInSeconds = expirationTime - currentTimeInSeconds;
            const remainingTime = {
                hours: Math.floor(remainingTimeInSeconds / 3600),
                minutes: Math.floor((remainingTimeInSeconds % 3600) / 60),
                seconds: remainingTimeInSeconds % 60,
            }

            return res.status(200).send({
                application: APP_NAME,
                message: 'JWT is valid.',
                data: {
                    remainingTime,
                    payload: verify,
                    token: bearer.split(' ')[1],
                },
            });
        } catch (e) {
            console.error(e);

            return res.status(401).send({
                application: APP_NAME,
                message: 'JWT is invalid!',
            });
        }
    },
    createData: async (req, res) => {
        const {
            name = '',
            email = '',
            password = '',
        } = req.body || {};

        const { error } = validate.createData({
            name,
            email,
            password
        } || {});

        if (error) {
            return res.status(400).send({
                application: APP_NAME,
                message: 'Error, please check all required fields and try again!',
            });
        }

        try {
            const response = await model.createData({
                name,
                email,
                password,
            });

            return res.status(201).send({
                application: APP_NAME,
                message: 'New user account registered successfully.',
                data: response,
            });
        } catch (e) {
            console.error(e);

            return res.status(500).send({
                application: APP_NAME,
                message: 'Error when creating new user account!',
            });
        }
    },
    editData: async (req, res) => {
        const {
            name = '',
            email = '',
            password = '',
        } = req.body || {};

        if (!name && !email && !password) {
            return res.status(400).send({
                application: APP_NAME,
                message: 'No data provided, nothing to update!',
            });
        }

        const { error } = validate.editData({
            name,
            email,
            password
        } || {});

        if (error) {
            return res.status(400).send({
                application: APP_NAME,
                message: 'Invalid name, email, or password, please try again!',
            });
        }

        const bearer = req.headers.authorization;
        const verify = validateToken(bearer);

        try {
            const data = {};
            if (name) data.name = name;
            if (email) data.email = email;
            if (password) data.password = password;

            const response = await model.editData(verify.id, data);

            return res.status(200).send({
                application: APP_NAME,
                message: 'User account updated successfully.',
                data: response,
            });
        } catch (e) {
            console.error(e);

            return res.status(500).send({
                application: APP_NAME,
                message: 'Error when updating user account!',
            });
        }
    },
    deleteData: async (req, res) => {
        const bearer = req.headers.authorization;
        const verify = validateToken(bearer);

        try {
            await model.deleteData(verify.id);

            return res.status(200).send({
                application: APP_NAME,
                message: 'User account deleted successfully.',
            });
        } catch (e) {
            console.error(e);

            return res.status(500).send({
                application: APP_NAME,
                message: 'Error when updating user account!',
            });
        }
    },
}
