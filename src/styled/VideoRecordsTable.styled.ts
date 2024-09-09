import { Box } from '@mui/material';
import { styled } from 'styled-components';

import { theme } from './theme';

const VideoRecordsTableWrapper = styled(Box)`
    position: relative;
    padding: 16px;
    background-color: ${theme.palette.background.paper};
    flex-grow: 1;
`;

export { VideoRecordsTableWrapper };
