import styled from 'styled-components';

import { Box, Grid } from '@mui/material';

const GridSidebar = styled(Grid)`
    background-color: ${({ theme }) => theme.color.background};
    height: 100vh;
`;

const SidebarHeader = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px 0;
`;

const SliderTab = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;

const GridAudioList = styled(Grid)`
    padding: 12px;
`;

const AudioRecordsTableWrapper = styled(Box)`
    position: relative;
`;

const CircularProgressWrapper = styled(Box)`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.color.backgroundOpacity};
    z-index: 1;
`;

export {
    GridSidebar,
    SidebarHeader,
    GridAudioList,
    AudioRecordsTableWrapper,
    CircularProgressWrapper,
    SliderTab,
};
