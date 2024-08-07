import { useEffect, useRef, useState } from 'react';
import { useReactMediaRecorder, StatusMessages } from "react-media-recorder-2";
import WaveSurfer from 'wavesurfer.js';
import { CustomIconButtonProps } from "../types";


interface UseWaveSurferProps {
    selectedOutput?: string;
    selectedMic?: string;
}

interface UseWaveSurferReturn {
    status: StatusMessages;
    mediaBlobUrl?: string;
    actionButtons: CustomIconButtonProps[];
    startRecording: () => void;
}

const SETTINGS_MIC = {
    mimeType: 'audio/webm',
    timeSlice: 1000,
}

const WAVESURFER_SETTINGS = {
    container: '#wavesurfer-id',
    height: 140,
    cursorWidth: 1,
    barWidth: 2,
    normalize: true,
    fillParent: true,
}

const useWaveSurfer = ({ selectedOutput, selectedMic }: UseWaveSurferProps): UseWaveSurferReturn => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [playerReady, setPlayerReady] = useState(false);

    const wavesurfer = useRef<WaveSurfer | null>(null);

    const { status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl } =
        useReactMediaRecorder({
            audio: selectedMic ? { deviceId: { exact: selectedMic } } : true,
            video: false,
            askPermissionOnMount: true
        });

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

    useEffect(() => {
        if (mediaBlobUrl && wavesurfer.current) {
            wavesurfer.current?.load(mediaBlobUrl)
        } else {
            wavesurfer.current = null;
            clearBlobUrl()
        }

        return () => {
            if (wavesurfer.current) {
                wavesurfer.current.destroy();
            }
        }
    }, [mediaBlobUrl])

    useEffect(() => {
        if (selectedOutput && wavesurfer.current)
        wavesurfer.current?.setSinkId(selectedOutput);
    }, [selectedOutput]);

    const togglePlayback = () => {
        if (!isPlaying) {
            wavesurfer.current?.play()
        } else {
            wavesurfer.current?.pause()
        }
    }

    const BlobURLToFile = async (tempFile: string) => {
        const response = await fetch(tempFile);
        const data = await response.blob();
        const metadata = { type: SETTINGS_MIC.mimeType}

        return new File([data], 'mic_recording.webm', metadata);
    }

    const handleDone = async () => {
        if (mediaBlobUrl) {
            try {
                const file = await BlobURLToFile(mediaBlobUrl)
                console.log({ file }, 'file', mediaBlobUrl, playerReady)

                clearBlobUrl()
            } catch (error) {
                console.log(error);
            }
        }
    }

    const actionButtons: CustomIconButtonProps[] = [
        { condition: !isPlaying && mediaBlobUrl, iconName: 'playArrow', onClick: togglePlayback },
        { condition: isPlaying && mediaBlobUrl, iconName: 'pause', onClick: togglePlayback },
        { condition: status === 'stopped' && mediaBlobUrl, iconName: 'replay', onClick: clearBlobUrl },
        { condition: status === 'recording', iconName: 'stop', onClick: stopRecording, $square: true, color: 'red' },
        { condition: status === 'stopped' && mediaBlobUrl, iconName: 'done', onClick: handleDone, color: 'green' },
    ]

    return {
        status,
        mediaBlobUrl,
        actionButtons,
        startRecording,
    };
};

export default useWaveSurfer;
