import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Box, Paper, Typography } from '@mui/material';

const AuthStyled = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
`;

const FormTitle = styled(Typography)`
    padding-bottom: 24px;
`;

const PaperAuthStyled = styled(Paper)`
    width: 100%;
    padding: 24px 16px;
    gap: 24px;
`;

const FormAuthStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`;

const LinkStyled = styled(Link)`
    text-decoration: none;
    margin-left: 8px;
    color: ${({ theme }) => theme.color.primary};
`;

const ForgotPasswordStyled = styled(Typography)`
    display: flex;
    justify-content: end;
`;

const EmailSentBlockStyled = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 24px;
`;

export {
    AuthStyled,
    FormTitle,
    PaperAuthStyled,
    FormAuthStyled,
    LinkStyled,
    ForgotPasswordStyled,
    EmailSentBlockStyled,
};
