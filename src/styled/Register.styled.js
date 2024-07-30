import { Box, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";

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
    margin-left: 8px;
    color: ${({ theme }) => theme.color.primary};
`;


export {
    AuthStyled,
    FormTitle,
    PaperAuthStyled,
    FormAuthStyled,
    LinkStyled
};
