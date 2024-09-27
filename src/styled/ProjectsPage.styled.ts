import styled from 'styled-components';
import { Box, ListItem } from '@mui/material';

import { FlexCenterStyled } from './GlobalStyle.styled';

import { theme } from './theme';

const SidebarStyled = styled(Box)`
    width: 240px;
    height: 100%;
`;

const SidebarHeaderStyled = styled(FlexCenterStyled)`
    display: flex;
    justify-content: space-between;
    padding: 8px 12px 0;
`;

const SidebarHeaderTitle = styled(FlexCenterStyled)`
    gap: 8px;
`;

const StyledListItem = styled(ListItem)<{ $isselected: boolean }>`
    cursor: pointer;
    background-color: ${({ $isselected }) =>
        $isselected ? '#00000014' : 'transparent'};
    &:hover {
        background-color: ${theme.palette.grey[100]};
    }
`;

const IconContainer = styled(FlexCenterStyled)``;

const ProjectsPageMainBlock = styled(Box)<{ $open: boolean }>`
    margin-left: ${({ $open }) => ($open ? '240px' : 0)};
`;

const AddProjectFormStyled = styled(FlexCenterStyled)`
    margin: 4px 4px 8px;
`;

const EditProjectFormStyled = styled(FlexCenterStyled)``;

const ProjectPageHeaderStyled = styled(Box)<{ $startItems: boolean }>`
    display: flex;
    align-items: ${({ $startItems }) => ($startItems ? 'start' : 'center')};
    justify-content: space-between;
    padding: 16px;
`;

const ProfileBlockStyled = styled(FlexCenterStyled)`
    gap: 12px;
`;

const MenuAudioFormHeaderStyled = styled(Box)<{ $startItems: boolean }>`
    display: flex;
    align-items: ${({ $startItems }) => ($startItems ? 'start' : 'center')};
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
    background-color: ${theme.palette.grey[100]};
    z-index: 1;
`;

export {
    SidebarHeaderStyled,
    ProjectPageHeaderStyled,
    SidebarStyled,
    SidebarHeaderTitle,
    StyledListItem,
    IconContainer,
    ProjectsPageMainBlock,
    AddProjectFormStyled,
    EditProjectFormStyled,
    MenuAudioFormHeaderStyled,
    ProfileBlockStyled,
    CircularProgressWrapper,
};
