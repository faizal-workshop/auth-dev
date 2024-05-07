const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const keyFolderPath = path.join(__dirname, '..', '.keys');

async function generateRSAKeyPair() {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
        },
    });

    const privateKeyFile = path.join(keyFolderPath, 'private.pem');
    const publicKeyFile = path.join(keyFolderPath, 'public.pem');

    fs.writeFileSync(privateKeyFile, privateKey);
    fs.writeFileSync(publicKeyFile, publicKey);

    return publicKey;
}

module.exports = {
    getData: async (req, res) => {
        if (!fs.existsSync(keyFolderPath)) fs.mkdirSync(keyFolderPath);
        const keyPath = path.join(keyFolderPath, 'public.pem');

        if (fs.existsSync(keyPath)) {
            return fs.readFileSync(keyPath, 'utf8');
        }

        const result = await generateRSAKeyPair();
        return result;
    },
    createData: async (req, res) => {
        if (!fs.existsSync(keyFolderPath)) fs.mkdirSync(keyFolderPath);
        const result = await generateRSAKeyPair();

        return result;
    },
}
