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

interface OptionBase {
    value: string;
    label: string;
}

interface ICustomSelectProps {
    title: string;
    selected: string;
    options: OptionBase[];
    onHandleChange: (id: string) => void;
}

interface CustomIconButtonProps {
    iconName: 'done' | 'stop' | 'playArrow' | 'pause' | 'replay' | 'mic';
    [key: string]: any;
    condition?: boolean | string;
    color?: string;
    onClick: () => void;
}

interface IAudioRecord {
    id: string;
    date: {
        _seconds: number;
        _nanoseconds: number;
    };
    author: string;
    name: string;
    project: string;
    projectId: string;
    comment: string;
    audioFileUrl: string;
}

interface IProjects {
    id: string;
    name: string;
}

export {
    type IAuthParams,
    type IHandleResetPassword,
    type IHandleForgotPassword,
    type OptionBase,
    type ICustomSelectProps,
    type CustomIconButtonProps,
    type IAudioRecord,
    type IProjects,
};
