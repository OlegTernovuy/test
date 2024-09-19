import { useEffect, useRef } from 'react';

import { CustomIconButton } from '../../index';
import { ActionsContentStyled } from '../../../styled/CustomMediaRecorder.styled';
import {
    CustomAudioPlayer,
    WavesurferAudioPlayer,
} from '../../../styled/AudioRecordsTable.styled';

import useAudioPlayer from '../../../hook/useAudioPlayer';

const AudioPlayerComponent = ({
    audioUrl,
    selectedOutput,
    audioId,
}: {
    audioUrl: string;
    selectedOutput: string;
    audioId: string;
}) => {
    const containerId = `audio-player-${audioId}`;
    const containerRef = useRef<HTMLDivElement>(null);
    const { wavesurfer, actionButtons } = useAudioPlayer(
        containerId,
        selectedOutput,
    );

    useEffect(() => {
        if (containerRef.current && wavesurfer.current) {
            wavesurfer.current.load(audioUrl);
        } else {
            wavesurfer.current = null;
        }

        return () => {
            if (wavesurfer.current) {
                wavesurfer.current.destroy();
            }
        };
    }, [audioUrl, wavesurfer]);

    return (
        <CustomAudioPlayer>
            <WavesurferAudioPlayer id={containerId} ref={containerRef} />
            <ActionsContentStyled>
                {actionButtons.map((buttonInfo, index) => (
                    <CustomIconButton key={index} {...buttonInfo} />
                ))}
            </ActionsContentStyled>
        </CustomAudioPlayer>
    );
};

export default AudioPlayerComponent;
