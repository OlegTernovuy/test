import styled from 'styled-components';

import { Box, TextField } from '@mui/material';
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

const StyledTextarea = styled(TextField)`
    width: 100%;
    max-width: 400px;
`;

export { AudioRecordsTableWrapper, ProjectTitleSearchStyled, StyledTextarea };
