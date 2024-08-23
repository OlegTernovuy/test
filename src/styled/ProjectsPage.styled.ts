import styled from 'styled-components';

import { Box, Grid, ListItem } from '@mui/material';

const GridSidebar = styled(Grid)`
    background-color: ${({ theme }) => theme.color.background};
    height: 100vh;
`;

const SliderStyled = styled(Box)`
    width: 240px;
`

const SidebarHeaderStyled = styled(Box)`
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

const StyledListItem = styled(ListItem)<{ isSelected: boolean }>`
    cursor: pointer;
    background-color: ${({ isSelected }) =>
        isSelected ? 'rgba(0, 0, 0, 0.08)' : 'transparent'};
    &:hover {
        background-color: rgba(0, 0, 0, 0.04);
    }
`;

const IconContainer = styled(Box)`
    display: flex;
    align-items: center;
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

const ProjectPageHeaderStyled = styled(Box)`
    display: flex;
    align-items: end;
`;

export {
    GridSidebar,
    SidebarHeaderStyled,
    GridAudioList,
    AudioRecordsTableWrapper,
    CircularProgressWrapper,
    SliderTab,
    ProjectPageHeaderStyled,
    SliderStyled,
    StyledListItem,
    IconContainer
};
