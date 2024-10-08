import { ReactNode } from 'react';

import { Box, Button, Typography } from '@mui/material';
import {
    FormAuthStyled,
    FormTitle,
    LinkStyled,
} from '../../styled/AuthForm.styled';
import AuthFormWrapper from './AuthFormWrapper';

interface IFormProps {
    children: ReactNode;
    title: string;
    link?: string;
    onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
    hideLink?: boolean;
    isSubmiting?: boolean;
}

const AuthForm = ({
    title,
    link,
    onSubmit,
    hideLink,
    children,
    isSubmiting,
}: IFormProps) => {
    return (
        <AuthFormWrapper>
            <FormTitle variant="h5">{title}</FormTitle>
            <FormAuthStyled onSubmit={onSubmit}>
                {children}
                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmiting}
                    size="large"
                >
                    {title}
                </Button>
                {!hideLink && (
                    <Box>
                        <Typography variant="body2">
                            {link === 'login'
                                ? 'Already have an account?'
                                : 'Don`t have an account?'}
                            <LinkStyled to={`/${link}`}>
                                {link === 'login' ? 'Login' : 'Register'}
                            </LinkStyled>
                        </Typography>
                    </Box>
                )}
            </FormAuthStyled>
        </AuthFormWrapper>
    );
};

export default AuthForm;
