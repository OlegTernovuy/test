import { FormControl } from '@mui/material';
import styled from 'styled-components';

import { theme } from './theme';

const AudioRecordWrapper = styled.div`
    display: flex;
    gap: 20px;
`;

const AudioRecordFormStyled = styled.form`
    display: flex;
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
    width: 100%;
    resize: vertical;
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
    AudioRecordFormStyled,
    AudioRecordWrapper,
    CustomFormSelectStyled,
    StyledTextarea,
};
