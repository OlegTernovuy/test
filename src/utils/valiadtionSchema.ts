import * as yup from 'yup';

const passwordRules = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
const audioFileUrl = /https:\/\/storage.googleapis.com\/axels-loki.appspot.com/;

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
        .min(3, 'Audio record must contain at least 3 characters'),
    author: yup
        .string()
        .email()
        .required('Author is required')
        .min(3, 'Author must contain at least 3 characters'),
    comment: yup.string(),
    audioFileUrl: yup.string().matches(audioFileUrl, 'Must contain base url'),
});

const AddAudioRecordSchema = UpdateAudioRecordSchema.shape({});

export {
    loginSchema,
    registerSchema,
    resetPasswordSchema,
    UpdateAudioRecordSchema,
    AddAudioRecordSchema,
};
