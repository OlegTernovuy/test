import { useEffect, useRef } from 'react';

import { CustomIconButton } from '../../index';
import { ActionsContentStyled } from '../../../styled/CustomMediaRecorder.styled';
import {
    CustomAudioPlayer,
    WavesurferAudioPlayer,
} from '../../../styled/AudioRecordsTable.styled';

import useAudioPlayer from '../../../hook/useAudioPlayer';

//test 2

const AudioPlayerComponent = ({
    audioUrl,
    selectedOutput,
    audioId,
    isSelected,
    onSelect,
}: {
    audioUrl: string;
    selectedOutput: string;
    audioId: string;
    isSelected: boolean;
    onSelect: () => void;
}) => {
    const containerId = `audio-player-${audioId}`;
    const { actionButtons } = useAudioPlayer(
        containerId,
        selectedOutput,
        audioUrl,
        isSelected
    );

    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audioElement = audioRef.current;
        if (audioElement && 'setSinkId' in audioElement) {
            audioElement.setSinkId(selectedOutput).catch((error: any) => {
                console.error('Error setting audio output device:', error);
            });
        }
    }, [selectedOutput]);

    return (
        <div>
            <CustomAudioPlayer>
                <WavesurferAudioPlayer id={containerId} />
                <ActionsContentStyled>
                    {actionButtons.map((buttonInfo, index) => (
                        <CustomIconButton key={index} {...buttonInfo} />
                    ))}
                </ActionsContentStyled>
            </CustomAudioPlayer>
        </div>
    );
};

export default AudioPlayerComponent;
