import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';

import { ForgotPasswordStyled, LinkStyled } from '../../styled/AuthForm.styled';
import { AuthForm } from '../../components';
import { TextField } from '@mui/material';

import { loginSchema } from '../../utils/validationSchema';
import { useAuth } from '../../Providers/AuthProvider';

const LoginPage = () => {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { login } = useAuth();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: loginSchema,
        onSubmit: (values, { setErrors, setSubmitting }) => {
            login({
                authData: {
                    email: values.email,
                    password: values.password,
                },
                enqueueSnackbar,
                setErrors,
                navigate,
            }).finally(() => setSubmitting(false));
        },
    });

    return (
        <AuthForm
            title="Login"
            link="register"
            onSubmit={formik.handleSubmit}
            isSubmiting={formik.isSubmitting}
        >
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
