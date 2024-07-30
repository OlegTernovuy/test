import { Box, Button, Container, TextField, Typography } from '@mui/material';
import {
    AuthStyled,
    FormAuthStyled,
    FormTitle,
    LinkStyled,
    PaperAuthStyled,
} from '../styled/Register.styled';

interface IFormProps {
    title: string;
    link: string;
}

const AuthForm = ({ title, link }: IFormProps) => {
    return (
        <Container component="main" maxWidth="xs">
            <AuthStyled>
                <PaperAuthStyled elevation={3}>
                    <FormTitle variant="h5">{title}</FormTitle>
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
                            {title}
                        </Button>
                        <Box>
                            <Typography variant="body2">
                                {link === 'login'
                                    ? 'Already have an account'
                                    : 'Don`t have an account'}
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
