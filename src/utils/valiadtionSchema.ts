import * as yup from 'yup';

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

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

const resetPasswordSchema = yup.object({
    password: yup
        .string()
        .required('Password is required')
        .matches(passwordRules, 'Please enter a strong password'),
    confirmPassword: yup
        .string()
        .required('Confirm password is required')
        .oneOf([yup.ref('password')], 'Passwords must match'),
});

const UpdateAudioRecordSchema = yup.object({
    name: yup
        .string()
        .required('Audio record name is required')
        .min(3, 'Audio record must contain at least 5 characters'),
    author: yup
        .string()
        .required('Author is required')
        .min(3, 'Author must contain at least 5 characters'),
    project: yup
        .string()
        .required('Project is required')
        .min(3, 'Project must contain at least 5 characters'),
});

const AddAudioRecordSchema = UpdateAudioRecordSchema.shape({
    comment: yup.string(),
    projectId: yup
        .string()
        .min(3, 'projectId must contain at least 5 characters'),
    audioFileUrl: yup
        .string()
        .min(3, 'audioFileUrl must contain at least 5 characters'),
});

export {
    loginSchema,
    registerSchema,
    resetPasswordSchema,
    UpdateAudioRecordSchema,
    AddAudioRecordSchema
};
