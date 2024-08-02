import { useSearchParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';

import { AuthForm } from '../../components';
import { TextField } from '@mui/material';

import { resetPasswordSchema } from '../../utils/valiadtionSchema';
import { handleResetPassword } from '../../services/Auth.service';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { enqueueSnackbar } = useSnackbar();
    const oobCode: string | null = searchParams.get('oobCode');
    const formik = useFormik({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: resetPasswordSchema,
        onSubmit: (values) => {
            const password = values.password;
            handleResetPassword({
                password,
                navigate,
                oobCode,
                enqueueSnackbar,
            });
        },
    });

    return (
        <AuthForm
            title="Reset Password"
            hideLink
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
