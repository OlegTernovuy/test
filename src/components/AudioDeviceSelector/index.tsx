import React, { useState, useEffect } from 'react';
import { CustomSelect } from './components';
import { DivStyled } from "../../styled/AudioDeviceSelector.styled";

type IKind = 'audioinput' | 'audiooutput';

interface IDevices {
    kind: "audioinput" | "audiooutput" | "videoinput";
    label: string;
    value: string;
}

const getMediaDevices = (devices: MediaDeviceInfo[], name: IKind): IDevices[] => {
    const copyDevices = [...devices]

    const devicesArr = copyDevices
        .filter(device => device.kind === name)
        .map((device) => ({ value: device.deviceId, kind: device.kind, label: device.label }))

    return [...devicesArr];
}

interface AudioDeviceSelector {
    selectedMic: string;
    selectedOutput: string;
    setSelectedMic: (value: string) => void;
    onHandleChangeOutput: (value: string) => void;
}

const AudioDeviceSelector: React.FC<AudioDeviceSelector> = ({ selectedMic, setSelectedMic, selectedOutput, onHandleChangeOutput }) => {
    const [audioInputArr, setAudioInputArr] = useState<IDevices[]>([]);
    const [audioOutputArr, setAudioOutputArr] = useState<IDevices[]>([]);

    useEffect(() => {
        const getAllMicrophones = async () => {
            try {
                // Check if permission is already granted
                const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });

                if (permissionStatus.state !== 'granted') {
                    await navigator.mediaDevices.getUserMedia({ audio: true });
                }

                const devices = await navigator.mediaDevices.enumerateDevices();
                const audioInputArr = getMediaDevices(devices, 'audioinput');
                const audioOutputArr = getMediaDevices(devices, 'audiooutput');

                if (audioInputArr.length > 0) {
                    const audioInputId = audioInputArr[0].value;
                    setSelectedMic(audioInputId);
                }
                if (audioOutputArr.length > 0) {
                    const audioOutputId = audioOutputArr[0].value;
                    onHandleChangeOutput(audioOutputId);
                }

                setAudioInputArr(audioInputArr)
                setAudioOutputArr(audioOutputArr)
            } catch (error) {
                console.error('Error accessing media devices:', error);
            }
        }
        console.log('dfsd', selectedMic)
        getAllMicrophones()
    }, []);

    return (
        <DivStyled>
            <CustomSelect selected={selectedMic}
    title={'Audio Input'}
    options={audioInputArr}
    onHandleChange={setSelectedMic} />
    <CustomSelect selected={selectedOutput}
    title={'Audio Output'}
    options={audioOutputArr}
    onHandleChange={onHandleChangeOutput} />
    </DivStyled>
)
};

export default AudioDeviceSelector;
