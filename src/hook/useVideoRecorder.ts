import { useEffect, useState } from 'react';
import { useReactMediaRecorder, StatusMessages } from 'react-media-recorder-2';

import { useMediaSettings } from '../Providers/MediaSettingsProvider';
import { CustomIconButtonProps, ICustomSelectProps } from '../types';
import { putVideo, updateVideoFile } from '../services/Video.service';

interface UseMediaRecorderReturn {
    status: StatusMessages;
    mediaBlobUrl?: string;
    previewStream: MediaStream | null;
    actionButtons: CustomIconButtonProps[];
    selectors: ICustomSelectProps[];
    startRecording: () => void;
    stopRecording: () => void;
    clearBlobUrl: () => void;
    handleDone: () => Promise<void | string>;
    handleUpdate: (oldFileUrl: string) => Promise<string>;
    setShouldPreview: (value: boolean) => void;
    selectedInput: string;
}

const useMediaRecorder = (): UseMediaRecorderReturn => {
    const { videoDevices } = useMediaSettings();
    const { selectedInput, selectors, mediaStream, setShouldPreview } =
        videoDevices;

    const [mediaConstraints, setMediaConstraints] =
        useState<MediaStreamConstraints>({
            video: selectedInput
                ? { deviceId: { exact: selectedInput } }
                : true,
        });

    const {
        status,
        startRecording: start,
        stopRecording,
        mediaBlobUrl,
        clearBlobUrl,
    } = useReactMediaRecorder(mediaConstraints);

    // Update media constraints when selectedInput changes
    useEffect(() => {
        setMediaConstraints({
            video: selectedInput
                ? { deviceId: { exact: selectedInput } }
                : true,
        });
    }, [selectedInput]);

    const startRecording = () => {
        clearBlobUrl();
        start();
    };

    const handleDone = async () => {
        if (mediaBlobUrl) {
            try {
                const response = await fetch(mediaBlobUrl);
                const blob = await response.blob();

                const file = new File([blob], 'recording.mp4', {
                    type: 'video/mp4',
                });

                const result = await putVideo(file);

                clearBlobUrl();

                return result.data.videoUrl;
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

                const file = new File([blob], 'recording.mp4', {
                    type: 'video/mp4',
                });

                const result = await updateVideoFile(file, oldFileUrl);
                clearBlobUrl();

                return result.data.videoUrl;
            } catch (error) {
                console.log(error);
            }
        }
    };

    const actionButtons: CustomIconButtonProps[] = [
        {
            condition: status === 'stopped' && mediaBlobUrl,
            iconName: 'replay',
            onClick: clearBlobUrl,
        },
    ];

    return {
        status,
        mediaBlobUrl,
        previewStream: mediaStream,
        actionButtons,
        selectors,
        startRecording,
        stopRecording,
        clearBlobUrl,
        handleDone,
        handleUpdate,
        setShouldPreview,
        selectedInput,
    };
};

export default useMediaRecorder;
