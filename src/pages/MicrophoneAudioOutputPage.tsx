import React, { useState } from 'react';
import { AudioDeviceSelector, CustomMediaRecorder  } from "../components";
import {
    TitleMicStyled,
    DivStyled
} from "../styled/Microphone.styled";

const MicrophoneAudioOutputPage = () => {
    const [selectedMic, setSelectedMic] = useState<string>('');
    const [selectedOutput, setSelectedOutput] = useState<string>('');

    return (
        <DivStyled>
            <TitleMicStyled>Microphone Audio Output</TitleMicStyled>
            <AudioDeviceSelector
                selectedMic={selectedMic}
                selectedOutput={selectedOutput}
                setSelectedMic={setSelectedMic}
                onHandleChangeOutput={setSelectedOutput} />
            <CustomMediaRecorder selectedMic={selectedMic} selectedOutput={selectedOutput} />
        </DivStyled>
    )
};

export default MicrophoneAudioOutputPage;
