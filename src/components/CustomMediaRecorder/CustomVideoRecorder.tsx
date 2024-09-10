import { ReactNode, RefObject } from 'react';
import { StatusMessages } from 'react-media-recorder-2';

import {
    ActionsButtonStyled,
    ActionsContentStyled,
    ActionsStyled,
    AudioRecorderStyled,
    ListenAudioStyled,
} from '../../styled/CustomMediaRecorder.styled';
import { CustomIconButtonProps } from '../../types';
import CustomIconButton from './CustomIconButton';
import { Stack } from '@mui/material';

interface ICustomVideoRecorder {
    previewVideoRef: RefObject<HTMLVideoElement>;
    status: StatusMessages;
    actionButtons: CustomIconButtonProps[];
    mediaBlobUrl?: string;
    startRecording: () => void;
    stopRecording?: () => void;
    disabled?: boolean;
    isAddingFroms?: boolean;
}

const CustomVideoRecorder = ({
    previewVideoRef,
    status,
    mediaBlobUrl,
    actionButtons,
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
            <Stack direction="row" alignItems="center" spacing={2}>
                <Stack direction="row">
                    <video
                        ref={previewVideoRef}
                        width={320}
                        height={160}
                        autoPlay
                    />
                    {mediaBlobUrl && (
                        <video
                            src={mediaBlobUrl}
                            width={320}
                            height={160}
                            controls
                        />
                    )}
                </Stack>
                <ListenAudioStyled $showmedia={!!mediaBlobUrl}>
                    <ActionsContentStyled>
                        {actionButtons.map((buttonInfo, index) => (
                            <CustomIconButton key={index} {...buttonInfo} />
                        ))}
                    </ActionsContentStyled>
                </ListenAudioStyled>
            </Stack>
        </AudioRecorderStyled>
    );
};

export default CustomVideoRecorder;
