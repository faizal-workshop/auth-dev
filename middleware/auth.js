import { APP_NAME } from '../source/configs.js';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

export default function (req, res, next) {
    const bearerToken = req.headers.authorization;

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const keyFolderPath = path.join(__dirname, '..', '.keys');
    const keyPath = path.join(keyFolderPath, 'public.pem');
    const jwtPublic = fs.readFileSync(keyPath, 'utf8');

    if (!bearerToken) {
        return res.status(401).send({
            application: APP_NAME,
            message: 'Missing authentication token!',
        });
    }

    const token = bearerToken.split(' ')[1];

    jwt.verify(token, jwtPublic, {
        algorithms: ['RS256'],
    }, (e, d) => {
        if (e) {
            req.log.error(e);

            return res.status(403).send({
                application: APP_NAME,
                message: 'Invalid authentication token!',
            });
        }

        req.user = d;
        next();
    });
}
