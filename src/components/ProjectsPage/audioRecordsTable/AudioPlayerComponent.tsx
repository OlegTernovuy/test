import { useEffect, useRef } from 'react';
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
    const { wavesurfer, isPlaying, togglePlayback, setOutputDevice } =
        useAudioPlayer(containerId);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            if (wavesurfer.current) {
                wavesurfer.current.load(audioUrl);
            }
        } else {
            console.error('Container not found');
        }
    }, [audioUrl, wavesurfer]);

    useEffect(() => {
        if (wavesurfer.current && selectedOutput) {
            setOutputDevice(selectedOutput);
        }
    }, [selectedOutput, setOutputDevice, wavesurfer]);

    return (
        <div>
            <div
                id={containerId}
                ref={containerRef}
                style={{ width: '100%', height: '40px' }}
            ></div>
            <button onClick={togglePlayback}>
                {isPlaying ? 'Pause' : 'Play'}
            </button>
        </div>
    );
};

export default AudioPlayerComponent;
