import styled from 'styled-components';

import {
    Box,
    Grid,
    ListItem,
    TableBody,
    TableCell,
    TableHead,
    TextField,
} from '@mui/material';
import { FlexCenterStyled } from './GlobalStyle.styled';

const SliderStyled = styled(Box)`
    width: 240px;
`;

const SidebarHeaderStyled = styled(FlexCenterStyled)`
    display: flex;
    align-items: center;
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

const GridAudioList = styled(Grid)`
    padding: 12px;
`;

const AudioRecordsTableWrapper = styled(Box)`
    position: relative;
    padding: 16px;
    background-color: ${({ theme }) => theme.color.background};
    flex-grow: 1;
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
    justify-content: space-between;
    padding: 16px 8px;
`;

const MenuAudioFormHeaderStyled = styled(Box)`
    display: flex;
    align-items: start;
`;

const StyledTableHead = styled(TableHead)`
    background-color: ${({ theme }) => theme.color.secondary};
`;

const StyledTableBody = styled(TableBody)`
    background-color: white;
`;

const StyledTableCell = styled(TableCell)`
    text-align: center !important;
`;

const StyledCommentCell = styled(StyledTableCell)<{ width?: string }>`
    max-width: ${({ width }) => width || 'auto'};
`;

const StyledTextarea = styled(TextField)`
    width: 100%;
    max-width: 400px;
`;

const ProjectTitleSearchStyled = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 16px;
`;

export {
    SidebarHeaderStyled,
    GridAudioList,
    AudioRecordsTableWrapper,
    CircularProgressWrapper,
    ProjectPageHeaderStyled,
    SliderStyled,
    StyledListItem,
    IconContainer,
    AddProjectFormStyled,
    EditProjectFormStyled,
    StyledCommentCell,
    StyledTableCell,
    StyledTextarea,
    MenuAudioFormHeaderStyled,
    ProjectTitleSearchStyled,
    StyledTableHead,
    StyledTableBody
};
