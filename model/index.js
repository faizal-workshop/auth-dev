const firebase = require('../src/firebase');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
const db = getFirestore(firebase);

module.exports = {
    documentation: async function () {
        try {
            const docsRef = collection(db, 'api-documentation');
            const querySnapshot = await getDocs(docsRef);
            const documents = [];

            querySnapshot.forEach((i) => {
                documents.push({ ...i.data() });
            });

            return documents;
        } catch (e) {
            console.error(e);
            throw new Error(e);
        }
    },
};
