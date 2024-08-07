import { useNavigate } from 'react-router';
import { useFormik } from 'formik';
import { useState } from 'react';

import { EmailSentBlockStyled } from '../../styled/AuthForm.styled';
import { Button, TextField, Typography } from '@mui/material';
import { AuthForm, AuthFormWrapper } from '../../components';

import { handleForgotPassword } from '../../services/Auth.service';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [emailSent, setEmailSent] = useState(false);

    const formik = useFormik({
        initialValues: {
            email: '',
        },
        onSubmit: (values, { setErrors, setSubmitting }) => {
            const email = values.email;
            handleForgotPassword({ email, setErrors, setEmailSent }).finally(
                () => setSubmitting(false)
            );
        },
    });

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
                    title="Forgot password"
                    hideLink
                    onSubmit={formik.handleSubmit}
                    isSubmiting={formik.isSubmitting}
                >
                    <TextField
                        variant="outlined"
                        type="email"
                        label="Email"
                        name="email"
                        required
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.email && Boolean(formik.errors.email)
                        }
                        helperText={formik.touched.email && formik.errors.email}
                    />
                </AuthForm>
            )}
        </>
    );
};

export default ForgotPassword;
