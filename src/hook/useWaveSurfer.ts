import React, { useEffect, useRef, useState } from 'react';
import { useReactMediaRecorder, StatusMessages } from 'react-media-recorder-2';
import WaveSurfer from 'wavesurfer.js';

import { CustomIconButtonProps, ICustomSelectProps } from '../types';
import { putMedia, updateAudioFile } from '../services/Audio.service';
import { useMediaSettings } from '../Providers/MediaSettingsProvider';

const WAVESURFER_SETTINGS = {
    height: 40,
    cursorWidth: 1,
    barWidth: 2,
    normalize: true,
    fillParent: true,
};

interface UseWaveSurferReturn {
    status: StatusMessages;
    wavesurfer: React.MutableRefObject<WaveSurfer | null>;
    mediaBlobUrl?: string;
    actionButtons: CustomIconButtonProps[];
    selectors: ICustomSelectProps[];
    selectedOutput: string;
    startRecording: () => void;
    stopRecording: () => void;
    clearBlobUrl: () => void;
    handleDone: () => Promise<void | ReturnType<typeof putMedia>>;
    handleUpdate: (
        oldFileUrl: string
    ) => Promise<void | ReturnType<typeof putMedia>>;
}

const useWaveSurfer = (containerId: string): UseWaveSurferReturn => {
    const {
        audioDevices: { selectedInput, selectedOutput, selectors },
    } = useMediaSettings();
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioConstraints, setAudioConstraints] =
        useState<MediaStreamConstraints>({
            audio: selectedInput
                ? { deviceId: { exact: selectedInput } }
                : true,
            video: false,
        });

    const wavesurfer = useRef<WaveSurfer | null>(null);

    const {
        status,
        startRecording: start,
        stopRecording,
        mediaBlobUrl,
        clearBlobUrl,
    } = useReactMediaRecorder(audioConstraints);

    // Update audio constraints when selectedInput changes
    useEffect(() => {
        setAudioConstraints({
            audio: selectedInput
                ? { deviceId: { exact: selectedInput } }
                : true,
            video: false,
        });
    }, [selectedInput]);

    const startRecording = () => {
        // Clear the previous recording if any
        clearBlobUrl();
        start();
    };

    // Initialize WaveSurfer when mediaBlobUrl is available
    useEffect(() => {
        if (!mediaBlobUrl) return;

        wavesurfer.current = WaveSurfer.create({
            ...WAVESURFER_SETTINGS,
            container: containerId,
        });

        if (wavesurfer.current) {
            wavesurfer.current.on('play', () => setIsPlaying(true));
            wavesurfer.current.on('pause', () => setIsPlaying(false));
        }

        if (selectedOutput && wavesurfer.current) {
            // Apply the selected output device whenever wavesurfer is initialized
            wavesurfer.current.setSinkId(selectedOutput);
        }

        return () => {
            if (wavesurfer.current) {
                setIsPlaying(false);
                wavesurfer.current.destroy();
            }
        };
    }, [mediaBlobUrl]);

    // Load the audio file into WaveSurfer when mediaBlobUrl changes
    useEffect(() => {
        if (mediaBlobUrl && wavesurfer.current) {
            wavesurfer.current?.load(mediaBlobUrl);
        } else {
            wavesurfer.current = null;
            clearBlobUrl();
        }

        return () => {
            if (wavesurfer.current) {
                wavesurfer.current.destroy();
            }
        };
    }, [mediaBlobUrl]);

    // Update output device for WaveSurfer without reinitializing
    useEffect(() => {
        if (wavesurfer.current && selectedOutput) {
            wavesurfer.current.setSinkId(selectedOutput).catch((err) => {
                console.error('Error setting sink ID:', err);
            });
        }
    }, [selectedOutput]);

    const togglePlayback = () => {
        if (!isPlaying) {
            wavesurfer.current?.play();
        } else {
            wavesurfer.current?.pause();
        }
    };

    const handleDone = async () => {
        if (mediaBlobUrl) {
            try {
                const response = await fetch(mediaBlobUrl);
                const blob = await response.blob();

                const file = new File([blob], 'recording.mp3', {
                    type: 'audio/mp3',
                });

                const result = await putMedia(file);

                clearBlobUrl();

                return result.data.audioUrl;
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleUpdate = async (oldFileUrl: string) => {
        if (mediaBlobUrl) {
            try {
                const response = await fetch(mediaBlobUrl);
                const blob = await response.blob();

                const file = new File([blob], 'recording.mp3', {
                    type: 'audio/mp3',
                });

                const result = await updateAudioFile(file, oldFileUrl);

                clearBlobUrl();

                return result.data.audioUrl;
            } catch (error) {
                console.log(error);
            }
        }
    };

    const actionButtons: CustomIconButtonProps[] = [
        {
            condition: !isPlaying && mediaBlobUrl,
            iconName: 'playArrow',
            onClick: togglePlayback,
        },
        {
            condition: isPlaying && mediaBlobUrl,
            iconName: 'pause',
            onClick: togglePlayback,
        },
        {
            condition: status === 'stopped' && mediaBlobUrl,
            iconName: 'replay',
            onClick: clearBlobUrl,
        },
    ];

    return {
        status,
        wavesurfer,
        mediaBlobUrl,
        actionButtons,
        selectors,
        selectedOutput,
        startRecording,
        stopRecording,
        clearBlobUrl,
        handleDone,
        handleUpdate,
    };
};

export default useWaveSurfer;
