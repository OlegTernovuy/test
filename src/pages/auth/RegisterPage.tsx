import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router';
import { useFormik } from 'formik';

import { AuthForm } from '../../components';
import { TextField } from '@mui/material';

import { registerSchema } from '../../utils/valiadtionSchema';
import { IHandleAuth } from '../../types';
import { auth } from '../../firebase';

interface IAuthForm {
    email: string;
    password: string;
    confirmPassword: string;
}

const RegisterPage = () => {
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
        } as IAuthForm,
        validationSchema: registerSchema,
        onSubmit: (values) => {
            handleRegister({ email: values.email, password: values.password });
        },
    });

    const navigate = useNavigate();

    const handleRegister = async ({ email, password }: IHandleAuth) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/home');
        } catch (error) {
            console.error('Error creating user with email and password', error);
        }
    };
    return (
        <AuthForm title="Register" link="login" onSubmit={formik.handleSubmit}>
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
            <TextField
                variant="outlined"
                type="password"
                label="Confirm password"
                name="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                error={
                    formik.touched.confirmPassword &&
                    Boolean(formik.errors.confirmPassword)
                }
                helperText={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                }
            />
        </AuthForm>
    );
};

export default RegisterPage;
