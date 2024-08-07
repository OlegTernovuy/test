interface IAuthCred {
    email: string;
    password: string;
}

interface IAuthParams {
    authData: IAuthCred;
    navigate: (path: string) => void;
    setErrors: (errors: Partial<IAuthCred>) => void;
    enqueueSnackbar: (message: string, options?: { variant: string }) => void;
}

interface IHandleResetPassword {
    password: string;
    oobCode: string | null;
    navigate: (path: string) => void;
    setErrors: (password: Partial<{ password: string }>) => void;
    enqueueSnackbar: (message: string, options?: { variant: string }) => void;
}

interface IHandleForgotPassword {
    email: string;
    setEmailSent: (value: boolean) => void;
    setErrors: (errors: Partial<{ email: string }>) => void;
}


interface CustomIconButtonProps {
    iconName: 'done' | 'stop' | 'playArrow' | 'pause' | 'replay' | 'mic';
    [key: string]: any;
    condition?: boolean | string;
    color?: string;
    onClick: () => void;
}

export {
    type IAuthParams,
    type IHandleResetPassword,
    type IHandleForgotPassword,
    type CustomIconButtonProps
};
