import { useState, useEffect } from 'react';
import { OptionBase, ICustomSelectProps } from '../types';

// Function to filter and map media devices based on their type (videoinput)
const getMediaDevices = (devices: MediaDeviceInfo[]): OptionBase[] => {
    return devices
        .filter((device) => device.kind === 'videoinput')
        .map((device) => ({
            value: device.deviceId,
            kind: device.kind,
            label: device.label,
        }));
};

// Custom hook to manage video devices
const useVideoDevices = () => {
    const [videoInputArr, setVideoInputArr] = useState<OptionBase[]>([]);
    const [videoOutputArr, setVideoOutputArr] = useState<OptionBase[]>([]);
    const [selectedInput, setSelectedInput] = useState<string>('');
    const [selectedOutput, setSelectedOutput] = useState<string>('');
    const [mediaInputStream, setMediaInputStream] =
        useState<MediaStream | null>(null);
    const [mediaOutputStream, setMediaOutputStream] =
        useState<MediaStream | null>(null);
    const [shouldPreviewStream, setShouldPreviewStream] =
        useState<boolean>(false);

    // Function to handle device changes
    const handleDeviceChange = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoInputArr = getMediaDevices(devices);
            const videoOutputArr = videoInputArr.filter(
                (device) => device.label === 'OBS Virtual Camera'
            );

            // Update video input options
            setVideoInputArr(videoInputArr);

            // Update video output options
            setVideoOutputArr(videoOutputArr);

            // If there are available input devices, set the first one as selected
            if (videoInputArr.length > 0) {
                if (!selectedInput) {
                    setSelectedInput(videoInputArr[0].value);
                }
            }

            // If there are available input devices, set the first one as selected
            if (videoOutputArr.length > 0) {
                if (!selectedOutput) {
                    setSelectedOutput(videoOutputArr[0].value);
                }
            }
        } catch (error) {
            console.error('Error accessing media devices:', error);
        }
    };

    // UseEffect to retrieve and set video devices (cameras)
    useEffect(() => {
        const getAllCameras = async () => {
            try {
                // Check camera permission
                const permissionStatus = await navigator.permissions.query({
                    name: 'camera' as PermissionName,
                });

                if (
                    permissionStatus.state !== 'granted' &&
                    shouldPreviewStream
                ) {
                    await navigator.mediaDevices.getUserMedia({ video: true });
                }

                // Set media stream for the selected input device
                if (selectedInput && shouldPreviewStream) {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: { deviceId: selectedInput },
                    });
                    setMediaInputStream(stream);
                }

                // Set media stream for the selected input device
                if (selectedOutput && shouldPreviewStream) {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: {
                            deviceId: {
                                exact: selectedOutput,
                            },
                        },
                    });
                    setMediaOutputStream(stream);
                }

                // Retrieve video devices
                handleDeviceChange();
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        };

        getAllCameras();

        // Add a listener for the device change event
        navigator.mediaDevices.addEventListener(
            'devicechange',
            handleDeviceChange
        );

        return () => {
            // Remove the listener when unmounting the component
            navigator.mediaDevices.removeEventListener(
                'devicechange',
                handleDeviceChange
            );
        };
    }, [selectedInput, selectedOutput, shouldPreviewStream]); // Dependency array includes selectedInput

    const inputSelectors: ICustomSelectProps[] = [
        {
            selected: selectedInput,
            onHandleChange: setSelectedInput,
            title: 'Video Input',
            options: videoInputArr,
        },
    ];

    const defaultSelector: ICustomSelectProps = {
        selected: selectedOutput,
        onHandleChange: setSelectedOutput,
        title: 'Video Output',
        options: videoOutputArr,
    };

    const outputSelectors: ICustomSelectProps[] = [
        selectedOutput ? defaultSelector : null,
    ].filter(Boolean) as ICustomSelectProps[];

    return {
        videoInputArr,
        selectedInput,
        selectedOutput,
        inputSelectors,
        outputSelectors,
        mediaInputStream,
        mediaOutputStream,
        setSelectedInput,
        setSelectedOutput,
        setShouldPreviewStream,
    };
};

export default useVideoDevices;
