import styled from 'styled-components';

import { Grid, Typography } from '@mui/material';

const GridSidebar = styled(Grid)`
    background-color: ${({ theme }) => theme.color.background};
    height: 100vh;
`;

const SidebarHeader = styled(Typography)`
    padding: 8px 12px 0;
`;

const GridAudioList = styled(Grid)`
    padding: 12px;
`;

export { GridSidebar, SidebarHeader, GridAudioList };
