import React from 'react';

import { Mic } from '@mui/icons-material';
import { Fab, CircularProgress } from '@mui/material';

import {
    DivStyled,
    AvesurferStyled,
    ActionsStyled,
    ActionsContentStyled,
    CircularProgressStyled
} from "../../styled/CustomMediaRecorder.styled";
import { HeaderMedia, CustomIconButton, CustomSelect } from "./components";
import useWaveSurfer from "../../hook/useWaveSurfer";

const CustomMediaRecorder: React.FC = () => {
    const {
        status,
        mediaBlobUrl,
        actionButtons,
        selectors,
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
        </DivStyled>
    )
};

export default CustomMediaRecorder;
