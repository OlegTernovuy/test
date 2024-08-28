import { FormControl } from '@mui/material';
import styled from 'styled-components';

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

export {
    SaveButtonStyled,
    AudioRecordFormStyled,
    AudioRecordWrapper,
    CustomFormSelectStyled,
};
