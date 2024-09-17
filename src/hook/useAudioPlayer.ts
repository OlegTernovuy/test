import { useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

const WAVESURFER_SETTINGS = {
    height: 40,
    cursorWidth: 1,
    barWidth: 2,
    normalize: true,
    fillParent: true,
};

interface UseWaveSurferReturn {
    wavesurfer: React.MutableRefObject<WaveSurfer | null>;
    isPlaying: boolean;
    togglePlayback: () => void;
    setOutputDevice: (deviceId: string) => void;
}

const useAudioPlayer = (containerId: string): UseWaveSurferReturn => {
    const wavesurfer = useRef<WaveSurfer | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlayback = () => {
        if (wavesurfer.current) {
            if (isPlaying) {
                wavesurfer.current.pause();
            } else {
                wavesurfer.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const setOutputDevice = (deviceId: string) => {
        if (wavesurfer.current) {
            wavesurfer.current.setSinkId(deviceId).catch((err) => {
                console.error('Error setting sink ID:', err);
            });
        }
    };

    useEffect(() => {
        if (containerId) {
            const container = document.getElementById(containerId);
            if (container) {
                wavesurfer.current = WaveSurfer.create({
                    ...WAVESURFER_SETTINGS,
                    container: `#${containerId}`,
                });

                return () => {
                    if (wavesurfer.current) {
                        wavesurfer.current.destroy();
                    }
                };
            } else {
                console.error('Container not found');
            }
        }
    }, [containerId]);

    return { wavesurfer, isPlaying, togglePlayback, setOutputDevice };
};

export default useAudioPlayer;
