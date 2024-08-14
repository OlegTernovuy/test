import React, { useEffect, useRef, useState } from 'react';
import { useReactMediaRecorder, StatusMessages } from 'react-media-recorder-2';
import WaveSurfer from 'wavesurfer.js';

import { CustomIconButtonProps, ICustomSelectProps } from '../types';
import useAudioDevices from './useAudioDevices';

interface UseWaveSurferReturn {
    status: StatusMessages;
    wavesurfer: React.MutableRefObject<WaveSurfer | null>;
    mediaBlobUrl?: string;
    actionButtons: CustomIconButtonProps[];
    selectors: ICustomSelectProps[];
    startRecording: () => void;
}

const WAVESURFER_SETTINGS = {
    container: '#wavesurfer-id',
    height: 140,
    cursorWidth: 1,
    barWidth: 2,
    normalize: true,
    fillParent: true,
}

// Custom hook that handles audio recording, WaveSurfer player setup, and UI interactions
const useWaveSurfer = (): UseWaveSurferReturn => {
    const { selectedInput, selectedOutput, selectors } = useAudioDevices(); // Manage audio input/output devices

    const [isPlaying, setIsPlaying] = useState(false);
    const [playerReady, setPlayerReady] = useState(false);

    const wavesurfer = useRef<WaveSurfer | null>(null);

    const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
        useReactMediaRecorder({
            audio: selectedInput ? { deviceId: { exact: selectedInput } } : true,
            video: false,
            askPermissionOnMount: true
        }); // React hook to handle media recording

    // Effect to initialize WaveSurfer when mediaBlobUrl is available
    useEffect(() => {
        if (!mediaBlobUrl) return;

        wavesurfer.current = WaveSurfer.create(WAVESURFER_SETTINGS);

        if (wavesurfer.current) {
            wavesurfer.current.on('ready', () => setPlayerReady(true));
            wavesurfer.current.on('play', () => setIsPlaying(true));
            wavesurfer.current.on('pause', () => setIsPlaying(false));
        }

        return () => {
            if (wavesurfer.current) {
                setIsPlaying(false);
                wavesurfer.current.destroy();
            }
        };
    }, [status, mediaBlobUrl]);

    // Effect to load the recorded audio into WaveSurfer when mediaBlobUrl changes
    useEffect(() => {
        if (mediaBlobUrl && wavesurfer.current) {
            wavesurfer.current?.load(mediaBlobUrl)
        } else {
            wavesurfer.current = null;
            clearBlobUrl()
        }

        return () => {
            if (wavesurfer.current) {
                wavesurfer.current.destroy(); // Cleanup WaveSurfer instance
            }
        }
    }, [mediaBlobUrl])

    // Effect to update the output device for WaveSurfer
    useEffect(() => {
        if (wavesurfer.current instanceof WaveSurfer && selectedOutput) {
            wavesurfer.current?.setSinkId(selectedOutput);
        }
    }, [selectedOutput, wavesurfer]);

    const togglePlayback = () => {
        if (!isPlaying) {
            wavesurfer.current?.play()
        } else {
            wavesurfer.current?.pause()
        }
    }

    const handleDone = async () => {
        if (mediaBlobUrl) {
            try {
                // Get Blob with Blob URL
                const response = await fetch(mediaBlobUrl);
                const blob = await response.blob();

                // Created file with Blob
                const file = new File([blob], 'recording.wav', { type: blob.type });
                console.log({ file }, 'file', mediaBlobUrl, playerReady);

                clearBlobUrl();
            } catch (error) {
                console.log(error);
            }
        }
    }

    // Array of button configurations for UI actions
    const actionButtons: CustomIconButtonProps[] = [
        { condition: !isPlaying && mediaBlobUrl, iconName: 'playArrow', onClick: togglePlayback },
        { condition: isPlaying && mediaBlobUrl, iconName: 'pause', onClick: togglePlayback },
        { condition: status === 'stopped' && mediaBlobUrl, iconName: 'replay', onClick: clearBlobUrl },
        { condition: status === 'recording', iconName: 'stop', onClick: stopRecording, $square: true, color: 'red' },
        { condition: status === 'stopped' && mediaBlobUrl, iconName: 'done', onClick: handleDone, color: 'green' },
    ]

    return {
        status,
        wavesurfer,
        mediaBlobUrl,
        actionButtons,
        selectors,
        startRecording,
    };
};

export default useWaveSurfer;
