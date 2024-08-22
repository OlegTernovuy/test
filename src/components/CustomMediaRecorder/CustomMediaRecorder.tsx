import React from 'react';

import {
    AvesurferStyled,
    ActionsStyled,
    ActionsContentStyled,
} from '../../styled/CustomMediaRecorder.styled';
import { Mic } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { CustomIconButton, HeaderMedia } from '../index';

import { ICustomMediaRecorder } from '../../types';

const CustomMediaRecorder: React.FC<ICustomMediaRecorder> = ({
    status,
    mediaBlobUrl,
    actionButtons,
    startRecording,
}) => {
    return (
        <>
            <ActionsStyled>
                <HeaderMedia status={status} mediaBlobUrl={mediaBlobUrl} />
                {status !== 'recording' && !mediaBlobUrl && (
                    <IconButton onClick={startRecording} size="small">
                        <Mic color={'secondary'} />
                    </IconButton>
                )}
                <ActionsContentStyled>
                    {actionButtons.map((buttonInfo, index) => (
                        <CustomIconButton key={index} {...buttonInfo} />
                    ))}
                </ActionsContentStyled>
            </ActionsStyled>
            {mediaBlobUrl && <AvesurferStyled id="wavesurfer-id" />}
        </>
    );
};

export default CustomMediaRecorder;
