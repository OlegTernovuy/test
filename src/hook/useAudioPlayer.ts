import { useState, useRef, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

import { CustomIconButtonProps } from '../types';

const WAVESURFER_SETTINGS = {
    height: 40,
    cursorWidth: 1,
    barWidth: 2,
    normalize: true,
    fillParent: true,
};

interface UseWaveSurferReturn {
    wavesurfer: React.MutableRefObject<WaveSurfer | null>;
    actionButtons: CustomIconButtonProps[];
}

const useAudioPlayer = (
    containerId: string,
    selectedOutput: string,
    audioUrl: string,
    isSelected: boolean
): UseWaveSurferReturn => {
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

    useEffect(() => {
        if (!containerId) return;
        const container = document.getElementById(containerId);
        if (!container) return;

        if (isSelected) {
            wavesurfer.current = WaveSurfer.create({
                ...WAVESURFER_SETTINGS,
                container: `#${containerId}`,
            });

            wavesurfer.current.on('play', () => setIsPlaying(true));
            wavesurfer.current.on('pause', () => setIsPlaying(false));
        }

        if (selectedOutput && wavesurfer.current) {
            wavesurfer.current.setSinkId(selectedOutput);
        }

        return () => {
            if (wavesurfer.current) {
                setIsPlaying(false);
                wavesurfer.current.destroy();
            }
        };
    }, [containerId, isSelected]);

    useEffect(() => {
        if (!wavesurfer.current) return;
        if (isSelected && audioUrl) {
            wavesurfer.current.load(audioUrl);
        } else {
            wavesurfer.current.empty();
        }
    }, [audioUrl, isSelected]);

    useEffect(() => {
        if (wavesurfer.current && selectedOutput) {
            wavesurfer.current.setSinkId(selectedOutput).catch((err) => {
                console.error('Error setting sink ID:', err);
            });
        }
    }, [selectedOutput]);

    const actionButtons: CustomIconButtonProps[] = [
        {
            condition: !isPlaying,
            iconName: 'playArrow',
            onClick: togglePlayback,
        },
        {
            condition: isPlaying,
            iconName: 'pause',
            onClick: togglePlayback,
        },
    ];

    return {
        wavesurfer,
        actionButtons,
    };
};

export default useAudioPlayer;
