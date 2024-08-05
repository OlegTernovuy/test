import {
    confirmPasswordReset,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { auth, db } from '../firebase';
import {
    IAuthParams,
    IHandleForgotPassword,
    IHandleResetPassword,
} from '../types';

const handleLogin = async ({ authData, setErrors, navigate }: IAuthParams) => {
    const { email, password } = authData;
    try {
        const { user } = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const userFireDoc = await getDoc(doc(db, 'users', user.uid));
        if (userFireDoc.exists() && userFireDoc.data().isDisabled) {
            await auth.signOut();
            console.log('User is disabled. Please contact the administrator');
        }

        navigate('/home');
    } catch (error) {
        console.error('Error login user with email and password', error);
        setErrors({ password: (error as Error).message });
    }
};

const handleRegister = async ({
    authData,
    setErrors,
    navigate,
}: IAuthParams) => {
    const { email, password } = authData;
    try {
        const { user } = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            isDisabled: true,
        });
        await auth.signOut();
        navigate('/login');
    } catch (error) {
        console.error('Error creating user with email and password', error);
        setErrors({ email: (error as Error).message });
    }
};

const handleResetPassword = async ({
    password,
    oobCode,
    navigate,
    enqueueSnackbar,
}: IHandleResetPassword) => {
    try {
        if (oobCode) {
            await confirmPasswordReset(auth, oobCode, password);
            navigate('/login');
            enqueueSnackbar('Password successfully reset', {
                variant: 'success',
            });
        } else {
            console.error('oobCode is missing');
        }
    } catch (error) {
        console.error('Error set new password', error);
    }
};

const handleForgotPassword = async ({
    email,
    setEmailSent,
    setErrors,
}: IHandleForgotPassword) => {
    try {
        await sendPasswordResetEmail(auth, email);
        setEmailSent(true);
    } catch (error) {
        console.error('Error reset password', error);
        setErrors({ email: (error as Error).message });
    }
};

export {
    handleLogin,
    handleRegister,
    handleResetPassword,
    handleForgotPassword,
};
