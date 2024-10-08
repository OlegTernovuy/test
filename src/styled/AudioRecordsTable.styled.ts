import styled from 'styled-components';
import { Box } from '@mui/material';

import { FlexCenterStyled } from './GlobalStyle.styled';

import { theme } from './theme';

const MediaRecordsTableWrapper = styled(Box)`
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

const FormattedDateStyled = styled.div`
    white-space: pre-line;
`;

const CustomAudioPlayer = styled(FlexCenterStyled)`
    gap: 8px;
`;
const WavesurferAudioPlayer = styled.div`
    width: 100%;
    height: 40px;
`;

export {
    MediaRecordsTableWrapper,
    ProjectTitleSearchStyled,
    FormattedCommentStyled,
    FormattedDateStyled,
    CustomAudioPlayer,
    WavesurferAudioPlayer,
};
