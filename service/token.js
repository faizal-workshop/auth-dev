import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const keyFolderPath = path.join(__dirname, '..', '.keys');
const keyPath = path.join(keyFolderPath, 'public.pem');
const jwtPublic =
    fs.existsSync(keyPath) ? fs.readFileSync(keyPath, 'utf8') : null;

export default function decodeToken(token) {
    if (!token) return false;

    const payload = jwt.decode(token);
    return payload || false;
}

export function validateToken(bearer) {
    if (!bearer) return false;

    const token = bearer.split(' ')[1];
    if (!token) return false;

    try {
        return jwt.verify(token, jwtPublic, {
            algorithms: ['RS256'],
        });
    } catch (e) {
        return false;
    }
}
