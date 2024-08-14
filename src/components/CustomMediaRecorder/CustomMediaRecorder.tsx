import React from 'react';

import { Mic } from '@mui/icons-material';
import { Fab, CircularProgress } from '@mui/material';

import {
    DivStyled,
    AvesurferStyled,
    ActionsStyled,
    ActionsContentStyled,
    CircularProgressStyled,
    NameStyled,
    AudioStyled,
    MediaStyled,
} from '../../styled/CustomMediaRecorder.styled';
import CustomSelect from './CustomSelect';
import HeaderMedia from './HeaderMedia';
import CustomIconButton from './CustomIconButton';
import useWaveSurfer from '../../hook/useWaveSurfer';

const CustomMediaRecorder: React.FC = () => {
    const {
        status,
        mediaBlobUrl,
        actionButtons,
        selectors,
        publicAudios,
        startRecording,
    } = useWaveSurfer();

    if (!selectors[0].selected) {
        return (
            <CircularProgressStyled>
                <CircularProgress />
            </CircularProgressStyled>
        )
    }
    return (
        <DivStyled>
            <MediaStyled>
                {selectors.map((selector, index) => (
                    <CustomSelect key={index} {...selector} />
                ))}
                <ActionsStyled>
                    <HeaderMedia status={status} mediaBlobUrl={mediaBlobUrl} />
                    {status !== 'recording' && !mediaBlobUrl && (
                        <Fab onClick={startRecording} color="default">
                            <Mic color={'secondary'} />
                        </Fab>
                    )}
                    <ActionsContentStyled>
                        {actionButtons.map((buttonInfo, index) =>
                            <CustomIconButton key={index} {...buttonInfo}/>
                        )}
                    </ActionsContentStyled>
                </ActionsStyled>
                {mediaBlobUrl && <AvesurferStyled id="wavesurfer-id" />}
            </MediaStyled>
            {publicAudios && publicAudios.map((audio, index) => (
                <AudioStyled key={index}>
                    <NameStyled>{audio.name}</NameStyled>
                    <audio key={index} src={audio.url} controls />
                </AudioStyled>
            ))}
        </DivStyled>
    )
};

export default CustomMediaRecorder;
