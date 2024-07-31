import React, { ReactNode, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Navigate } from 'react-router-dom';

import { auth } from '../firebase';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [user, setUser] = useState<boolean | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(!!currentUser);
        });

        return () => unsubscribe();
    }, []);

    if (user === null) {
        return <p>Loading...</p>;
    }

    return user ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
