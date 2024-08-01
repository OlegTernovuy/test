import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router';
import { useFormik } from 'formik';

import { ForgotPasswordStyled, LinkStyled } from '../../styled/AuthForm.styled';
import { AuthForm } from '../../components';
import { TextField } from '@mui/material';

import { loginSchema } from '../../utils/valiadtionSchema';
import { IHandleAuth } from '../../types';
import { auth } from '../../firebase';

interface IAuthForm {
    email: string;
    password: string;
}

const LoginPage = () => {
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        } as IAuthForm,
        validationSchema: loginSchema,
        onSubmit: (values) => {
            handleLogin({ email: values.email, password: values.password });
        },
    });

    const navigate = useNavigate();

    const handleLogin = async ({ email, password }: IHandleAuth) => {
        if (!auth) {
            console.error('Firebase auth not initialized');
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/home');
        } catch (error) {
            console.error('Error login user with email and password', error);
        }
    };
    return (
        <AuthForm title="Login" link="register" onSubmit={formik.handleSubmit}>
            <TextField
                variant="outlined"
                type="email"
                label="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
                variant="outlined"
                type="password"
                label="Password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                    formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
            />
            <ForgotPasswordStyled variant="body2">
                <LinkStyled to="/forgot-password">Forgot Password?</LinkStyled>
            </ForgotPasswordStyled>
        </AuthForm>
    );
};

export default LoginPage;
