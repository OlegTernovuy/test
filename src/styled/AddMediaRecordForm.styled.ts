import styled from 'styled-components';
import { FormControl } from '@mui/material';

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

const CustomFormSelectStyled = styled(FormControl)`
    max-width: 180px;
`;

const StyledTextarea = styled.textarea`
    width: 100%;
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
    MediaRecordFormStyled,
    MediaRecordWrapper,
    CustomFormSelectStyled,
    StyledTextarea,
};
