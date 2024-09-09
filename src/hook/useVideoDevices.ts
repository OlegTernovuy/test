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
    const [selectedInput, setSelectedInput] = useState<string>('');
    const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
    const [shouldPreviewStream, setShouldPreviewStream] =
        useState<boolean>(false);

    // Function to handle device changes
    const handleDeviceChange = async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoInputArr = getMediaDevices(devices);

            // Update video input options
            setVideoInputArr(videoInputArr);

            // If there are available devices, set the first one as selected
            if (videoInputArr.length > 0) {
                if (!selectedInput) {
                    setSelectedInput(videoInputArr[0].value);
                }
            } else {
                setSelectedInput('1');
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

                if (permissionStatus.state === 'granted') {
                    // Set media stream for the selected input device
                    if (selectedInput && shouldPreviewStream) {
                        const stream =
                            await navigator.mediaDevices.getUserMedia({
                                video: { deviceId: selectedInput },
                            });
                        setMediaStream(stream);
                    }
                }

                // Retrieve video input devices
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
    }, [selectedInput, shouldPreviewStream]); // Dependency array includes selectedInput

    const selectors: ICustomSelectProps[] = [
        {
            selected: selectedInput,
            onHandleChange: setSelectedInput,
            title: 'Video Input',
            options: videoInputArr,
        },
    ];

    return {
        videoInputArr,
        selectedInput,
        selectors,
        setSelectedInput,
        mediaStream,
        setShouldPreview: setShouldPreviewStream,
    };
};

export default useVideoDevices;
