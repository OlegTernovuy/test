import { Box, Button, Container, TextField, Typography } from '@mui/material';
import {
    AuthStyled,
    FormAuthStyled,
    FormTitle,
    LinkStyled,
    PaperAuthStyled,
} from '../styled/Register.styled';

const AuthForm = ({ title, link }) => {
    const titlePage = link === 'login' ? 'Login' : 'Register';
    return (
        <Container component="main" maxWidth="xs">
            <AuthStyled>
                <PaperAuthStyled elevation={3}>
                    <FormTitle component="h1" variant="h5">
                        {title}
                    </FormTitle>
                    <FormAuthStyled>
                        <TextField
                            variant="outlined"
                            type="email"
                            required
                            label="Email"
                        />
                        <TextField
                            variant="outlined"
                            type="password"
                            required
                            label="Password"
                        />
                        <Button type="submit" variant="contained" size="large">
                            {titlePage}
                        </Button>
                        <Box>
                            <Typography variant="body2">
                                {link === 'login'
                                    ? 'Already have an account'
                                    : 'Don`t have an account'}
                                <LinkStyled to={`/${link}`}>
                                    {titlePage}
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
