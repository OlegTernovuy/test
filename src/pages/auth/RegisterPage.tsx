import { useNavigate } from 'react-router';
import { useFormik } from 'formik';

import { AuthForm } from '../../components';
import { TextField } from '@mui/material';

import { registerSchema } from '../../utils/valiadtionSchema';
import { handleRegister } from '../../services/Auth.service';

const RegisterPage = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            confirmPassword: '',
        },
        validationSchema: registerSchema,
        onSubmit: (values, { setErrors }) => {
            handleRegister({
                authData: {
                    email: values.email,
                    password: values.password,
                },
                setErrors,
                navigate,
            });
        },
    });

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
