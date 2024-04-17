const firebaseAdmin = require('../src/firebase-admin');
const db = firebaseAdmin.firestore();

module.exports = {
    documentation: async function () {
        try {
            const docsRef = db.collection('api-documentation');
            const querySnapshot = await docsRef.get();
            const documents = [];

            querySnapshot.forEach((i) => {
                documents.push(i.data());
            });

            return documents;
        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    },
};
