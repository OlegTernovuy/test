import styled from 'styled-components';

import { Box, TableBody, TableCell, TableHead, TextField } from '@mui/material';
import { FlexCenterStyled } from './GlobalStyle.styled';

const AudioRecordsTableWrapper = styled(Box)`
    position: relative;
    padding: 16px;
    background-color: ${({ theme }) => theme.color.background};
    flex-grow: 1;
`;

const ProjectTitleSearchStyled = styled(FlexCenterStyled)`
    justify-content: space-between;
    padding: 16px;
`;

const StyledTableHead = styled(TableHead)`
    background-color: ${({ theme }) => theme.color.secondary};
`;

const StyledTableCell = styled(TableCell)`
    text-align: center !important;
`;

const StyledCommentCell = styled(StyledTableCell)<{ mediaBlobUrl?: string }>`
    max-width: ${({ width }) => width || 'auto'};
`;

const StyledTableBody = styled(TableBody)`
    background-color: white;
`;

const StyledTextarea = styled(TextField)`
    width: 100%;
    max-width: 400px;
`;

export {
    AudioRecordsTableWrapper,
    ProjectTitleSearchStyled,
    StyledTableHead,
    StyledTableCell,
    StyledCommentCell,
    StyledTableBody,
    StyledTextarea,
};
