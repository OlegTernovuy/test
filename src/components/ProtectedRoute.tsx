import React from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress } from '@mui/material';

import { CircularProgressWrapper } from '../styled/ProjectsPage.styled';

import { useAuth } from '../Providers/AuthProvider';

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <CircularProgressWrapper>
                <CircularProgress />
            </CircularProgressWrapper>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
