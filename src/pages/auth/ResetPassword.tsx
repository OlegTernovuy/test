import { confirmPasswordReset } from 'firebase/auth';
import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { useFormik } from 'formik';

import { AuthForm } from '../../components';
import { TextField } from '@mui/material';

import { resetPasswordSchema } from '../../utils/valiadtionSchema';
import { auth } from '../../firebase';

const ResetPassword = () => {
    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: resetPasswordSchema,
        onSubmit: (values) => {
            handleLogin(values.password);
        },
    });

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const oobCode: string | null = searchParams.get('oobCode');

    const handleLogin = async (password: string) => {
        if (!auth) {
            console.error('Firebase auth not initialized');
            return;
        }
        try {
            if (oobCode) {
                await confirmPasswordReset(auth, oobCode, password);
                navigate('/login');
            } else {
                console.error('oobCode is missing');
            }
        } catch (error) {
            console.error('Error login user with email and password', error);
        }
    };

    return (
        <AuthForm
            title="Reset Password"
            link="login"
            onSubmit={formik.handleSubmit}
        >
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

export default ResetPassword;
