import { useFormik } from 'formik';

import { AuthForm } from '../components';
import { TextField } from '@mui/material';

import { loginSchema } from '../utils/valiadtionSchema';

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
            console.log(values);
        },
    });
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
        </AuthForm>
    );
};

export default LoginPage;
