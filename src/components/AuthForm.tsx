import { ReactNode } from 'react';

import { Box, Button, Container, Typography } from '@mui/material';
import {
    AuthStyled,
    FormAuthStyled,
    FormTitle,
    LinkStyled,
    PaperAuthStyled,
} from '../styled/AuthForm.styled';

interface IFormProps {
    children: ReactNode;
    title: string;
    link: string;
    onSubmit: any;
}

const AuthForm = ({ title, link, onSubmit, children }: IFormProps) => {
    return (
        <Container component="main" maxWidth="xs">
            <AuthStyled>
                <PaperAuthStyled elevation={3}>
                    <FormTitle variant="h5">{title}</FormTitle>
                    <FormAuthStyled onSubmit={onSubmit}>
                        {children}
                        <Button type="submit" variant="contained" size="large">
                            {title}
                        </Button>
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
                    </FormAuthStyled>
                </PaperAuthStyled>
            </AuthStyled>
        </Container>
    );
};

export default AuthForm;
