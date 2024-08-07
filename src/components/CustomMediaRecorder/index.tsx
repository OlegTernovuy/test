import React from 'react';

import { Mic } from '@mui/icons-material';
import { Fab } from '@mui/material';
import {
    DivStyled,
    AvesurferStyled,
    ActionsStyled,
    ActionsDiv
} from "../../styled/CustomMediaRecorder.styled";
import { HeaderMedia, CustomIconButton } from "./components";
import useWaveSurfer from "../../hook/useWaveSurfer";

interface CustomMediaRecorderProps {
    selectedMic: string;
    selectedOutput: string;
}

const CustomMediaRecorder: React.FC<CustomMediaRecorderProps> = ({ selectedMic, selectedOutput }) => {
    const {
        status,
        mediaBlobUrl,
        actionButtons,
        startRecording,
    } = useWaveSurfer({
        selectedOutput,
        selectedMic
    });

    return (
        <DivStyled>
            <ActionsDiv>
                <HeaderMedia status={status} mediaBlobUrl={mediaBlobUrl} />
                {status !== 'recording' && !mediaBlobUrl && (
                    <Fab
                        onClick={startRecording}
                        color="default">
                        <Mic color={'secondary'} />
                    </Fab>
                )}
                <ActionsStyled>
                    {actionButtons.map((buttonInfo, index) =>
                        <CustomIconButton key={index} {...buttonInfo}/>
                    )}
                </ActionsStyled>
            </ActionsDiv>
            {mediaBlobUrl && <AvesurferStyled id="wavesurfer-id" />}
        </DivStyled>
    )
};

export default CustomMediaRecorder;
