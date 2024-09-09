import { FormControl } from '@mui/material';
import styled from 'styled-components';

import { theme } from './theme';

const MediaRecordWrapper = styled.div`
    display: flex;
    gap: 20px;
`;

const MediaRecordFormStyled = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const SaveButtonStyled = styled.div`
    display: flex;
    align-items: start;
`;

const CustomFormSelectStyled = styled(FormControl)`
    max-width: 200px;
`;

const StyledTextarea = styled.textarea`
    min-width: 432px;
    width: 432px;
    padding: 8px 14px;
    border-radius: 4px;
    border-color: #0000003b;
    font-weight: 400;
    font-size: 1rem;
    line-height: 1.4375em;
    letter-spacing: 0.00938em;
    color: ${theme.palette.text.primary};
`;

export {
    SaveButtonStyled,
    MediaRecordFormStyled,
    MediaRecordWrapper,
    CustomFormSelectStyled,
    StyledTextarea,
};
