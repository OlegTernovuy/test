import React from 'react';
import { CustomMediaRecorder  } from "../components";
import { TitleMicStyled, DivStyled } from "../styled/AudioRecorderPage.styled";

const AudioRecorderPage = () => {
    return (
        <DivStyled>
            <TitleMicStyled>Microphone Audio Output</TitleMicStyled>
            <CustomMediaRecorder />
        </DivStyled>
    )
};

export default AudioRecorderPage;
