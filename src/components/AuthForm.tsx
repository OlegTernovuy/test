import { ReactNode } from 'react';

import { Box, Button, Container, Divider, Typography } from '@mui/material';
import {
    AuthStyled,
    FormAuthStyled,
    FormTitle,
    GoogleAuthButton,
    LinkStyled,
    PaperAuthStyled,
} from '../styled/Register.styled';

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
                        <Divider>
                            <Typography variant="body2">or</Typography>
                        </Divider>
                        <GoogleAuthButton
                            variant="outlined"
                            size="large"
                            startIcon={
                                <img
                                    src="/images/google-icon.png"
                                    alt="Google logo"
                                    width="24px"
                                    height="24px"
                                />
                            }
                        >
                            Sign in with Google
                        </GoogleAuthButton>
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
