import styled from 'styled-components';

import { Box } from '@mui/material';
import { FlexCenterStyled } from './GlobalStyle.styled';

import { theme } from './theme';

const AudioRecordsTableWrapper = styled(Box)`
    position: relative;
    padding: 16px;
    background-color: ${theme.palette.background.paper};
    flex-grow: 1;
`;

const ProjectTitleSearchStyled = styled(FlexCenterStyled)`
    justify-content: space-between;
    padding: 16px;
`;

const FormattedCommentStyled = styled.div`
    white-space: pre-wrap;
    word-wrap: break-word;
`;

export {
    AudioRecordsTableWrapper,
    ProjectTitleSearchStyled,
    FormattedCommentStyled,
};
