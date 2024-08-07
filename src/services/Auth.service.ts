import axios, { AxiosError } from 'axios';

import {
    IAuthParams,
    IHandleForgotPassword,
    IHandleResetPassword,
} from '../types';

axios.defaults.baseURL = 'http://localhost:4200';

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
        navigate('/home');
    } catch (error) {
        console.error('Error login user with email and password', error);
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                const { data } = axiosError.response;
                const errorMessage = (data as { message: string }).message;
                setErrors({ email: errorMessage });
            } else {
                setErrors({ email: axiosError.message });
            }
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
    } catch (error) {
        console.error('Error creating user with email and password', error);
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            if (axiosError.response && axiosError.response.data) {
                setErrors({ email: axiosError.response.data as string });
            } else {
                setErrors({ email: axiosError.message });
            }
        } else {
            setErrors({ email: (error as Error).message });
        }
    }
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
    handleLogin,
    handleRegister,
    handleLogoutUser,
    handleResetPassword,
    handleForgotPassword,
};
