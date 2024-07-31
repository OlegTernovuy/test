import * as yup from 'yup';

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z]).{5,}$/;

const loginSchema = yup.object({
    email: yup
        .string()
        .email()
        .required('Email is required')
        .min(5, 'Email must contain at least 5 characters')
        .max(30, 'Email should not contain more then 30 characters'),
    password: yup
        .string()
        .required('Password is required')
        .matches(passwordRules, 'Please enter a strong password'),
});

const registerSchema = loginSchema.shape({
    confirmPassword: yup
        .string()
        .required('Confirm password is required')
        .oneOf([yup.ref('password')], 'Passwords must match'),
});

export { loginSchema, registerSchema };
