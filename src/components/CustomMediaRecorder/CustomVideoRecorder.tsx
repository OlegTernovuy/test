import { ReactNode } from 'react';
import { StatusMessages } from 'react-media-recorder-2';

import {
    ActionsButtonStyled,
    ActionsStyled,
    AudioRecorderStyled,
} from '../../styled/CustomMediaRecorder.styled';

interface ICustomVideoRecorder {
    children: ReactNode;
    status: StatusMessages;
    mediaBlobUrl?: string;
    startRecording: () => void;
    stopRecording?: () => void;
    disabled?: boolean;
    isAddingFroms?: boolean;
}

const CustomVideoRecorder = ({
    children,
    status,
    mediaBlobUrl,
    startRecording,
    stopRecording,
    disabled,
    isAddingFroms,
}: ICustomVideoRecorder) => {
    return (
        <AudioRecorderStyled>
            <ActionsStyled>
                {status !== 'recording' && !mediaBlobUrl ? (
                    <ActionsButtonStyled onClick={startRecording}>
                        Start
                    </ActionsButtonStyled>
                ) : status === 'recording' ? (
                    <ActionsButtonStyled onClick={stopRecording}>
                        Stop
                    </ActionsButtonStyled>
                ) : (
                    ''
                )}
                {isAddingFroms && (
                    <ActionsButtonStyled
                        variant="contained"
                        type="submit"
                        disabled={disabled}
                    >
                        Save
                    </ActionsButtonStyled>
                )}
            </ActionsStyled>
            {children}
        </AudioRecorderStyled>
    );
};

export default CustomVideoRecorder;
