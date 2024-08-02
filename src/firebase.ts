import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';

const getEnvVariable = (variable: string): string => {
    const value = process.env[variable];
    if (!value) {
        throw new Error('Invalid environment variable');
    }
    return value;
};

let auth: Auth;

try {
    const firebaseConfig: FirebaseOptions = {
        apiKey: getEnvVariable('REACT_APP_FIREBASE_API_KEY'),
        authDomain: getEnvVariable('REACT_APP_FIREBASE_AUTH_DOMAIN'),
        projectId: getEnvVariable('REACT_APP_FIREBASE_PROJECT_ID'),
        storageBucket: getEnvVariable('REACT_APP_FIREBASE_STORAGE_BUCKET'),
        messagingSenderId: getEnvVariable(
            'REACT_APP_FIREBASE_MESSAGING_SEND_ID'
        ),
        appId: getEnvVariable('REACT_APP_FIREBASE_APP_ID'),
        measurementId: getEnvVariable('REACT_APP_FIREBASE_MEASUREMENT_ID'),
    };
    const app: FirebaseApp = initializeApp(firebaseConfig);
    auth = getAuth(app);
} catch (error) {
    console.error('Firebase initialization error:', error);
}

export { auth };
