import styled from 'styled-components';

import { Box, ListItem } from '@mui/material';
import { FlexCenterStyled } from './GlobalStyle.styled';

const SliderStyled = styled(Box)`
    width: 240px;
`;

const SidebarHeaderStyled = styled(FlexCenterStyled)`
    gap: 8px;
    padding: 8px 12px 0;
`;

const StyledListItem = styled(ListItem)<{ isSelected: boolean }>`
    cursor: pointer;
    background-color: ${({ isSelected }) =>
        isSelected ? 'rgba(0, 0, 0, 0.08)' : 'transparent'};
    &:hover {
        background-color: rgba(0, 0, 0, 0.04);
    }
`;

const IconContainer = styled(FlexCenterStyled)``;

const AddProjectFormStyled = styled(FlexCenterStyled)`
    margin: 4px 4px 8px;
`;

const EditProjectFormStyled = styled(FlexCenterStyled)``;

const ProjectPageHeaderStyled = styled(Box)`
    display: flex;
    align-items: start;
    justify-content: space-between;
    padding: 16px 8px;
`;

const ProfileBlockStyled = styled(FlexCenterStyled)`
    gap: 12px;
`;

const MenuAudioFormHeaderStyled = styled(Box)`
    display: flex;
    align-items: start;
`;

export {
    SidebarHeaderStyled,
    ProjectPageHeaderStyled,
    SliderStyled,
    StyledListItem,
    IconContainer,
    AddProjectFormStyled,
    EditProjectFormStyled,
    MenuAudioFormHeaderStyled,
    ProfileBlockStyled,
};
