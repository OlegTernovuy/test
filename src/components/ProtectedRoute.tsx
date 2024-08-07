import React, { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import axios from 'axios';

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [user, setUser] = useState<boolean | null>(null);
    const [authInitialized, setAuthInitialized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axios.get('/auth/check-auth', {
                    withCredentials: true,
                });
                setUser(!!res.data.user);
            } catch (error) {
                console.error('Error checking authentification', error);
                setUser(false);
            } finally {
                setAuthInitialized(true);
            }
        };

        checkAuth();
    }, []);

    if (!authInitialized) {
        return <p>Loading...</p>;
    }

    return user ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
