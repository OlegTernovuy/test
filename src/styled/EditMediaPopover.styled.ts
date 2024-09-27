import styled from 'styled-components';
import { Box, Button } from '@mui/material';

const OptionsWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
`;

const SelectedMoveMode = styled(OptionsWrapper)`
    display: flex;
    flex-direction: column;
    padding: 4px;
`;

const ConfirmMoveButton = styled(Button)`
    margin-top: 8px !important;
`;

export { OptionsWrapper, SelectedMoveMode, ConfirmMoveButton };
