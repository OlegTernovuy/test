import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';

import {
    checkAuthService,
    handleLogin,
    handleLogoutUser,
} from '../services/Auth.service';
import { IAuthParams } from '../types';

interface AuthContextType {
    user: any | null;
    isAdmin: boolean;
    loading: boolean;
    login: (authData: IAuthParams) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const authData = await checkAuthService();
            setUser(authData.user);
            setIsAdmin(authData.isAdmin);
        } catch (error) {
            console.error('Error checking auth', error);
            setUser(null);
            setIsAdmin(false);
        } finally {
            setLoading(false);
        }
    };

    const login = async ({
        authData,
        setErrors,
        navigate,
        enqueueSnackbar,
    }: IAuthParams) => {
        try {
            await handleLogin(authData);
            await checkAuth();
            enqueueSnackbar('Login successful', { variant: 'success' });
            navigate('/projects');
        } catch (error: any) {
            console.error('Error login user', error);
            if (error.response && error.response.data.error) {
                setErrors({ email: error.response.data.error });
            } else {
                setErrors({ email: error.message });
            }
        }
    };

    const logout = async () => {
        setUser(null);
        setIsAdmin(false);
        await handleLogoutUser();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAdmin,
                loading,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
