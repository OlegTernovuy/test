import { useEffect, useState } from 'react';
import { useReactMediaRecorder, StatusMessages } from 'react-media-recorder-2';
import { putMedia } from '../services/Media.service';
import { useMediaSettings } from '../Providers/MediaSettingsProvider';
import { CustomIconButtonProps, ICustomSelectProps } from '../types';

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
    handleUpdate: (oldFileUrl: string) => Promise<void | string>;
    setShouldPreview(value: boolean): void;
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

                const result = await putMedia(file);

                clearBlobUrl();

                return result.data.mediaUrl;
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

                console.log(file, oldFileUrl);

                // const result = await updateMediaFile(file, oldFileUrl);
                // clearBlobUrl();
                // return result.data.mediaUrl;
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
    };
};

export default useMediaRecorder;
