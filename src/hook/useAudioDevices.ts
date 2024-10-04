import { useState, useEffect } from 'react';
import { OptionBase, ICustomSelectProps } from '../types';

type IKind = 'audioinput' | 'audiooutput';

// Function to filter and map media devices based on their type (audioinput/audiooutput)
const getMediaDevices = (devices: MediaDeviceInfo[], name: IKind): OptionBase[] => {
    const copyDevices = [...devices]

    const devicesArr = copyDevices
        .filter(device => device.kind === name)
        .map((device) => ({
            value: device.deviceId,
            kind: device.kind,
            label: device.label
        }))

    return [...devicesArr];
}

// Custom hook to manage audio devices (input and output)
const useAudioDevices = () => {
    const [audioInputArr, setAudioInputArr] = useState<OptionBase[]>([]);
    const [audioOutputArr, setAudioOutputArr] = useState<OptionBase[]>([]);
    const [selectedInput, setSelectedInputState] = useState<string>('');
    const [selectedOutput, setSelectedOutputState] = useState<string>('');    

    const setSelectedInput = (input: string) => {
        setSelectedInputState(input);
        localStorage.setItem('audioInput', input) 
    }

    const setSelectedOutput = (output: string) => {
        setSelectedOutputState(output);
        localStorage.setItem('audioOutput', output) 
    }

    // UseEffect to retrieve and set audio devices (microphones and speakers)
    useEffect(() => {
        const getAllMicrophones = async () => {
            try {
                const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });

                if (permissionStatus.state !== 'granted') {
                    await navigator.mediaDevices.getUserMedia({ audio: true });
                }

                // Get the list of all media devices (audio input/output, etc.)
                const devices = await navigator.mediaDevices.enumerateDevices();

                // Filter and format audio input devices (microphones)
                const audioInputArr = getMediaDevices(devices, 'audioinput');

                // Filter and format audio output devices (speakers, headphones)
                const audioOutputArr = getMediaDevices(devices, 'audiooutput');

                const storedInput = localStorage.getItem('audioInput')
                const storedOutput = localStorage.getItem('audioOutput')

                if (audioInputArr.length > 0) {
                    const audioInputId = storedInput && audioInputArr.some((audioInput) => audioInput.value === storedInput)
                        ? storedInput
                        : audioInputArr[0].value;
                    setSelectedInput(audioInputId);
                    localStorage.setItem('audioInput', audioInputId);
                }
                
                if (audioOutputArr.length > 0) {
                    const audioOutputId = storedOutput && audioOutputArr.some((audioOutput) => audioOutput.value === storedOutput)
                        ? storedOutput
                        : audioOutputArr[0].value;
                    setSelectedOutput(audioOutputId);
                    localStorage.setItem('audioOutput', audioOutputId);
                }

                setAudioInputArr(audioInputArr);
                setAudioOutputArr(audioOutputArr);
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        };

        getAllMicrophones()

        // Add a listener for the device change event
        navigator.mediaDevices.addEventListener('devicechange', getAllMicrophones);
        return () => {
            // Remove the listener when dismantling a component
            navigator.mediaDevices.removeEventListener('devicechange', getAllMicrophones);
        };
    }, []);

    const selectors: ICustomSelectProps[] = [
        { selected: selectedInput, onHandleChange: setSelectedInput, title: 'Audio Input', options: audioInputArr },
        { selected: selectedOutput, onHandleChange: setSelectedOutput, title: 'Audio Output', options: audioOutputArr },
    ];

    const selectorOutput: ICustomSelectProps = {
        selected: selectedOutput, onHandleChange: setSelectedOutput, title: 'Audio Output', options: audioOutputArr
    }

    return {
        audioInputArr,
        audioOutputArr,
        selectedInput,
        selectedOutput,
        selectors,
        selectorOutput,
        setSelectedInput,
        setSelectedOutput,
    };
};

export default useAudioDevices;
