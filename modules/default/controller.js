import { APP_NAME } from '../../source/configs.js';
import firebaseAdmin from '../../source/firebase-admin.js';

const db = firebaseAdmin.firestore();

export default {
    root: async function (req, res) {
        return await res.status(200).view('./view/index.ejs', {
            app_name: APP_NAME,
        });
    },
    documentation: async function (req, res) {
        const docsRef = db.collection('api-documentation');
        const querySnapshot = await docsRef.get();
        const documents = [];

        querySnapshot.forEach((i) => {
            documents.push(i.data());
        });

        documents.forEach((item) => {
            if (item.body) item.body = JSON.parse(item.body);
            if (item.response) item.response = JSON.parse(item.response);
        });

        return await res.status(200).view('./view/documentation.ejs', {
            app_name: APP_NAME,
            documentation: documents,
        });
    },
    robotsTxt: async (req, res) => {
        const robotsTxtContent = `User-agent: *\nDisallow: /`;

        return await res.status(200)
            .header('Content-Type', 'text/plain')
            .send(robotsTxtContent);
    },
}
