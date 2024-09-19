import { useEffect, useRef } from 'react';

const AudioPlayerComponent = ({
    audioUrl,
    selectedOutput,
}: {
    audioUrl: string;
    selectedOutput: string;
}) => {
    const audioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const audioElement = audioRef.current;
        if (audioElement && 'setSinkId' in audioElement) {
            (audioElement as any)
                .setSinkId(selectedOutput)
                .catch((error: any) => {
                    console.error('Error setting audio output device:', error);
                });
        }
    }, [selectedOutput]);

    return <audio ref={audioRef} src={audioUrl} controls />;
};

export default AudioPlayerComponent;
