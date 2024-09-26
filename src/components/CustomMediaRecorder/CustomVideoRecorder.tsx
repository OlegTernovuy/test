import { ReactNode } from 'react';
import { StatusMessages } from 'react-media-recorder-2';
import { IconButton, Stack, Tooltip } from '@mui/material';
import SyncIcon from '@mui/icons-material/Sync';

import { CustomIconButton } from '../index';
import {
    ActionsButtonStyled,
    ActionsContentStyled,
    ActionsStyled,
    AudioRecorderStyled,
    ListenAudioStyled,
} from '../../styled/CustomMediaRecorder.styled';

import { CustomIconButtonProps } from '../../types';
import { useVirtualCamera } from '../../hook';
import { useOBS } from '../../Providers/OBSProvider';

interface ICustomVideoRecorder {
    children: ReactNode;
    status: StatusMessages;
    actionButtons: CustomIconButtonProps[];
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
    actionButtons,
    startRecording,
    stopRecording,
    disabled,
    isAddingFroms,
}: ICustomVideoRecorder) => {
    const { setWebcamSource } = useVirtualCamera({
        sceneName: 'loki-cam',
        inputName: 'Camera',
    });
    const { connected } = useOBS();

    const handleSyncWebcam = async () => {
        await setWebcamSource();
    };

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
                <Tooltip title="Sync cameras">
                    <span>
                        <IconButton
                            onClick={handleSyncWebcam}
                            disabled={!connected}
                        >
                            <SyncIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </ActionsStyled>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Stack direction="row">{children}</Stack>
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
