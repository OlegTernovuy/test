import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router';
import { useFormik } from 'formik';
import { useState } from 'react';

import { EmailSentBlockStyled } from '../../styled/AuthForm.styled';
import { Button, TextField, Typography } from '@mui/material';
import { AuthForm, AuthFormWrapper } from '../../components';

import { auth } from '../../firebase';

const ForgotPassword = () => {
    const formik = useFormik({
        initialValues: {
            email: '',
        },
        onSubmit: (values) => {
            handleSubmitResetPassword(values.email);
        },
    });

    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmitResetPassword = async (email: string) => {
        if (!auth) {
            console.error('Firebase auth not initialized');
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            setEmailSent(true);
        } catch (error) {
            console.error('Error reset password', error);
            setError((error as Error).message);
        }
    };
    return (
        <>
            {emailSent ? (
                <AuthFormWrapper>
                    <EmailSentBlockStyled>
                        <Typography variant="body1">
                            The Email has been sent, check your Inbox!
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/login')}
                        >
                            Back to login
                        </Button>
                    </EmailSentBlockStyled>
                </AuthFormWrapper>
            ) : (
                <AuthForm
                    title="Reset password"
                    link="register"
                    onSubmit={formik.handleSubmit}
                >
                    <TextField
                        variant="outlined"
                        type="email"
                        label="Email"
                        name="email"
                        required
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={Boolean(error)}
                        helperText={error && error}
                    />
                </AuthForm>
            )}
        </>
    );
};

export default ForgotPassword;
