import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { checkAuth } from '../services/Auth.service';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [user, setUser] = useState(false);
    const [authInitialized, setAuthInitialized] = useState(false);

    useEffect(() => {
        const authentificate = async () => {
            try {
                const data = await checkAuth();
                setUser(!!data.user);
            } catch (error) {
                console.error('Error checking authentification', error);
                setUser(false);
            } finally {
                setAuthInitialized(true);
            }
        };

        authentificate();
    }, []);

    if (!authInitialized) {
        return <p>Loading...</p>;
    }

    return user ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
