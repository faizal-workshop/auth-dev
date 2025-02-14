import { APP_NAME } from '../../source/configs.js';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { validateToken } from '../../service/token.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const keyFolderPath = path.join(__dirname, '..', '..', '.keys');

async function generateRSAKeyPair() {
    try {
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem'
            }
        });

        const privateKeyFile = path.join(keyFolderPath, 'private.pem');
        const publicKeyFile = path.join(keyFolderPath, 'public.pem');

        fs.writeFileSync(privateKeyFile, privateKey);
        fs.writeFileSync(publicKeyFile, publicKey);

        return publicKey;
    } catch (e) {
        console.error(e);
        throw new Error('Cannot generate key pair!');
    }
}

export default {
    getData: async (req, res) => {
        try {
            const keyFolderPath = path.join(__dirname, '..', '..', '.keys');
            const keyPath = path.join(keyFolderPath, 'public.pem');
            const jwtPublic =
                fs.existsSync(keyPath) ? fs.readFileSync(keyPath, 'utf8') : null;

            const jwkPublicKey = {
                kty: 'RSA',
                e: 'AQAB',
                n: jwtPublic.split('\n').slice(1, -2).join(''),
            }

            return res.status(200).send({
                application: APP_NAME,
                message: 'Get JWKS success.',
                data: [jwkPublicKey],
            });
        } catch (e) {
            return res.status(500).send({
                application: APP_NAME,
                message: 'Error when getting JWKS!',
            });
        }
    },
    createData: async (req, res) => {
        const bearer = req.headers.authorization;
        const verify = validateToken(bearer);

        if (verify.usertype !== 'administrator') {
            return await res.status(401).send({
                application: APP_NAME,
                message: 'Error, only administrator can generate new JWKS!',
            });
        }

        try {
            if (!fs.existsSync(keyFolderPath)) fs.mkdirSync(keyFolderPath);
            const result = await generateRSAKeyPair();

            const jwkPublicKey = {
                kty: 'RSA',
                e: 'AQAB',
                n: result.split('\n').slice(1, -2).join(''),
            }

            return res.status(201).send({
                application: APP_NAME,
                message: 'New keys generated and saved successfully.',
                data: [jwkPublicKey],
            });
        } catch (e) {
            return res.status(500).send({
                application: APP_NAME,
                message: 'Error when creating JWKS!',
            });
        }
    },
}
