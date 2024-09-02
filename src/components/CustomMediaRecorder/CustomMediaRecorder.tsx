import React from 'react';

import {
    AvesurferStyled,
    ActionsStyled,
    ActionsContentStyled,
    AudioRecorderStyled,
    ListenAudioStyled,
    ActionsButtonStyled,
} from '../../styled/CustomMediaRecorder.styled';
import { CustomIconButton } from '../index';

import { ICustomMediaRecorder } from '../../types';

const CustomMediaRecorder: React.FC<ICustomMediaRecorder> = ({
    status,
    mediaBlobUrl,
    actionButtons,
    startRecording,
    stopRecording,
    disabled,
    isAddingFroms,
    wavesurferId,
}) => {
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
            <ListenAudioStyled showmedia={!!mediaBlobUrl}>
                <AvesurferStyled id={wavesurferId} />
                <ActionsContentStyled>
                    {actionButtons.map((buttonInfo, index) => (
                        <CustomIconButton key={index} {...buttonInfo} />
                    ))}
                </ActionsContentStyled>
            </ListenAudioStyled>
        </AudioRecorderStyled>
    );
};

export default CustomMediaRecorder;
