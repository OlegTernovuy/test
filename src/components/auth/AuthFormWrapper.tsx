import { ReactNode } from 'react';

import { AuthStyled, PaperAuthStyled } from '../../styled/AuthForm.styled';
import { Container } from '@mui/material';

type AuthWrapperProps = {
    children: ReactNode;
};

const AuthFormWrapper = ({ children }: AuthWrapperProps) => {
    return (
        <Container component="div" maxWidth="xs">
            <AuthStyled>
                <PaperAuthStyled elevation={3}>{children}</PaperAuthStyled>
            </AuthStyled>
        </Container>
    );
};

export default AuthFormWrapper;
