import firebaseAdmin from '../../source/firebase-admin.js';
import firebase from '../../source/firebase.js';
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';

const adminAuth = firebaseAdmin.auth();
const adminDb = firebaseAdmin.firestore();
const auth = getAuth(firebase);

export default {
    login: async function (userData) {
        const {
            email = '',
            password = '',
        } = userData;

        try {
            const credential =
                await signInWithEmailAndPassword(auth, email, password);
            const meta =
                await adminDb.collection('usermeta').doc(credential.user.uid).get();
            const metaData = meta.data();

            return {
                id: credential.user.uid,
                name: metaData.name,
                email: credential.user.email,
                usertype: metaData.usertype,
            }
        } catch (e) {
            throw new Error(e);
        }
    },
    createData: async function (userData) {
        const {
            name = '',
            email = '',
            password = '',
        } = userData;

        try {
            const registeredUsername = name;
            const credential =
                await createUserWithEmailAndPassword(auth, email, password);
            const meta =
                adminDb.collection('usermeta').doc(credential.user.uid);

            await meta.set({
                name: registeredUsername,
                usertype: 'user',
            });

            return {
                id: credential.user.uid,
                name: registeredUsername,
                email: credential.user.email,
                createdAt: credential.user.metadata.createdAt,
            }
        } catch (e) {
            throw new Error(e);
        }
    },
    editData: async function (id, userData) {
        const {
            name = '',
            email = '',
            password = '',
        } = userData;

        try {
            if (name) {
                const meta = adminDb.collection('usermeta').doc(id);
                await meta.set({ name }, { merge: true });
            }
            if (email) await adminAuth.updateUser(id, { email });
            if (password) await adminAuth.updateUser(id, { password });

            const userInfo = await adminAuth.getUser(id);
            const meta = await adminDb.collection('usermeta').doc(id).get();
            const metaData = meta.data();

            return {
                id: userInfo.uid,
                name: metaData.name,
                email: userInfo.email,
                usertype: metaData.usertype,
            }
        } catch (e) {
            throw new Error(e);
        }
    },
    deleteData: async function (id) {
        try {
            const usermeta = adminDb.collection('usermeta').doc(id);

            await usermeta.delete();
            await adminAuth.deleteUser(id);
        } catch (e) {
            throw new Error(e);
        }
    },
}
