import { APP_NAME } from '../../source/configs.js';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { validateToken } from '../../service/token.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const keyFolderPath = path.join(__dirname, '..', '..', '.keys');

function generatePublicJWKS(publicKey) {
    const keyBuffer = Buffer.from(publicKey
        .replace(/-----BEGIN PUBLIC KEY-----/, '')
        .replace(/-----END PUBLIC KEY-----/, '')
        .replace(/\n/g, ''), 'base64');

    const jwk = crypto.createPublicKey({
        key: keyBuffer,
        format: 'der',
        type: 'spki',
    }).export({ format: 'jwk' });

    return {
        kty: jwk.kty,
        use: 'sig',
        alg: 'RS256',
        n: jwk.n,
        e: jwk.e,
    }
}

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

        const privateKeyPath = path.join(keyFolderPath, 'private.pem');
        const publicKeyPath = path.join(keyFolderPath, 'public.pem');

        fs.writeFileSync(privateKeyPath, privateKey);
        fs.writeFileSync(publicKeyPath, publicKey);

        return publicKey;
    } catch (e) {
        console.error(e);
        throw new Error('Cannot generate key pair!');
    }
}

export default {
    getData: async (req, res) => {
        try {
            if (!fs.existsSync(keyFolderPath)) fs.mkdirSync(keyFolderPath);
            const keyPath = path.join(keyFolderPath, 'public.pem');
            const publicKey = fs.existsSync(keyPath)
                ? fs.readFileSync(keyPath, 'utf8')
                : await generateRSAKeyPair();

            return res.status(200).send({
                keys: [generatePublicJWKS(publicKey)],
            });
        } catch (e) {
            console.error(e);

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
            return res.status(401).send({
                application: APP_NAME,
                message: 'Error, only administrator can generate new JWKS!',
            });
        }

        try {
            if (!fs.existsSync(keyFolderPath)) fs.mkdirSync(keyFolderPath);
            const result = await generateRSAKeyPair();

            return res.status(201).send({
                application: APP_NAME,
                message: 'New keys generated and saved successfully.',
                data: [generatePublicJWKS(result)],
            });
        } catch (e) {
            console.error(e);

            return res.status(500).send({
                application: APP_NAME,
                message: 'Error when creating JWKS!',
            });
        }
    },
}
