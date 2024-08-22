import { CustomSelect, CustomMediaRecorder } from '../index';
import {
    CircularProgressStyled,
    MediaStyled,
} from '../../styled/CustomMediaRecorder.styled';
import { CircularProgress } from '@mui/material';

import { ICustomMediaRecorderForm } from '../../types';

const CustomRecordAudioForm = ({
    status,
    mediaBlobUrl,
    actionButtons,
    selectors,
    startRecording,
}: ICustomMediaRecorderForm) => {
    if (!selectors[0].selected) {
        return (
            <CircularProgressStyled>
                <CircularProgress />
            </CircularProgressStyled>
        );
    }
    return (
        <MediaStyled>
            {selectors.map((selector, index) => (
                <CustomSelect key={index} {...selector} />
            ))}
            <CustomMediaRecorder
                status={status}
                mediaBlobUrl={mediaBlobUrl}
                actionButtons={actionButtons}
                startRecording={startRecording}
            />
        </MediaStyled>
    );
};

export default CustomRecordAudioForm;
