import {
    IAuthParams,
    IHandleForgotPassword,
    IHandleResetPassword,
} from '../types';
import axios from '../utils/axios';

const handleLogin = async ({
    authData,
    setErrors,
    navigate,
    enqueueSnackbar,
}: IAuthParams) => {
    const { email, password } = authData;

    try {
        const res = await axios.post(
            '/auth/login',
            {
                email,
                password,
            },
            {
                withCredentials: true,
            }
        );
        enqueueSnackbar(res.data.message, {
            variant: 'success',
        });
        navigate('/projects');
    } catch (error: any) {
        console.error('Error login user with email and password', error);
        if (error.response && error.response.data.error) {
            setErrors({ email: error.response.data.error });
        } else {
            setErrors({ email: (error as Error).message });
        }
    }
};

const handleRegister = async ({
    authData,
    setErrors,
    navigate,
    enqueueSnackbar,
}: IAuthParams) => {
    const { email, password } = authData;
    try {
        const res = await axios.post('/auth/register', {
            email,
            password,
        });
        enqueueSnackbar(res.data.message, {
            variant: 'success',
        });
        navigate('/login');
    } catch (error: any) {
        console.error('Error creating user with email and password', error);
        if (error.response && error.response.data.error) {
            setErrors({ email: error.response.data.error });
        } else {
            setErrors({ email: (error as Error).message });
        }
    }
};

const checkAuth = async () => {
    const res = await axios.get('/auth/check-auth', {
        withCredentials: true,
    });
    return res.data;
};

const handleLogoutUser = async () => {
    try {
        await axios.post('/auth/logout', {}, { withCredentials: true });
    } catch (error) {
        console.error('Error logout', error);
    }
};

const handleResetPassword = async ({
    password,
    oobCode,
    navigate,
    setErrors,
    enqueueSnackbar,
}: IHandleResetPassword) => {
    if (oobCode) {
        try {
            await axios.post('/auth/reset-password', { oobCode, password });
            navigate('/login');
            enqueueSnackbar('Password successfully reset', {
                variant: 'success',
            });
        } catch (error) {
            setErrors({ password: (error as Error).message });
        }
    } else {
        console.error('oobCode is missing');
    }
};

const handleForgotPassword = async ({
    email,
    setEmailSent,
    setErrors,
}: IHandleForgotPassword) => {
    try {
        await axios.post('/auth/forgot-password', { email });
        setEmailSent(true);
    } catch (error) {
        console.error('Error reset password', error);
        setErrors({ email: (error as Error).message });
    }
};

export {
    checkAuth,
    handleLogin,
    handleRegister,
    handleLogoutUser,
    handleResetPassword,
    handleForgotPassword,
};
