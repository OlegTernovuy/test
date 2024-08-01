import React, { ReactNode, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Navigate } from 'react-router-dom';

import { auth } from '../firebase';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [user, setUser] = useState<boolean | null>(null);
    const [authInitialized, setAuthInitialized] = useState(false);

    useEffect(() => {
        if (!auth) {
            console.error('Firebase auth not initialized');
            setAuthInitialized(true);
            return;
        }
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(!!currentUser);
            setAuthInitialized(true);
        });

        return () => unsubscribe();
    }, []);

    if (!authInitialized) {
        return <p>Loading...</p>;
    }

    return user ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
