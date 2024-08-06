import React, { useState, useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useReactMediaRecorder } from 'react-media-recorder-2';

import { Stop, PlayArrow, Pause, Replay, Mic, Done, FiberManualRecord, Cancel } from '@mui/icons-material';
import { IconButton, DialogContent, Fab, Dialog, FormControl, InputLabel, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
    TitleMic,
    DivWrapper,
    DialogHeaderWrapper,
    DialogTitleWrapper,
    IconButtonWrapper,
    AvesurferWrapper,
    ActionsWrapper,
    DialogActionsWrapper,
    CancelIconButtonWrapp
} from "../styled/MicrophoneStyle";

const SETTINGS_MIC = {
    mimeType: 'audio/webm',
    timeSlice: 1000,
}

type IKind = 'audioinput' | 'audiooutput';

interface IDevices {
    deviceId: string;
    kind: string;
    label: string;
}

const getMediaDevices = (devices: IDevices[], name: IKind) => {
    return devices.filter(device => device.kind === name);
}

const MicrophoneAudioOutputPage = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [tempFile, setTempFile] = useState<string | null>(null);
    const [open, setOpen] = useState(true);
    const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
    const [playerReady, setPlayerReady] = useState<boolean>(false);
    const [audioInputArr, setAudioInputArr] = useState<IDevices[]>([]);
    const [audioOutputArr, setAudioOutputArr] = useState<IDevices[]>([]);
    const [selectedMic, setSelectedMic] = useState<string>('');
    const [selectedOut, setSelectedOut] = useState<string>('');

    const wavesurfer = useRef<WaveSurfer | null>(null);
    const mediaStreamRef = useRef<any>(null);

    useEffect(() => {
       const getAllMicrophones = async () => {
           await navigator.mediaDevices.getUserMedia({ audio: true });

           const devices = await navigator.mediaDevices.enumerateDevices();
           const audioInputArr = getMediaDevices(devices, 'audioinput');
           const audioOutputArr = getMediaDevices(devices, 'audiooutput');

           if (audioInputArr.length > 0) {
               setSelectedMic(audioInputArr[0].deviceId); // Set the first available microphone
               applyMediaStream(audioInputArr[0].deviceId); // Fetch media stream for the selected microphone
           }
           if (audioOutputArr.length > 0) {
               setSelectedOut(audioOutputArr[0].deviceId); // Set the first available audio output
           }
           setAudioInputArr(audioInputArr)
           setAudioOutputArr(audioOutputArr)
       }

        getAllMicrophones()
    }, []);

    useEffect(() => {
        if (!isRecording) {
            setSecondsRemaining(0);
            return;
        }

        const progressFn = () => {
            setSecondsRemaining(oldSecondsRemaining => {
                if (oldSecondsRemaining === 300) {
                    setIsRecording(false);
                    return 0;
                }
                return oldSecondsRemaining  + 1;
            })
        }

        const timer = setInterval(progressFn, SETTINGS_MIC.timeSlice);

        return () => {
            clearInterval(timer);
        }
    }, [isRecording])

    useEffect(() => {
        if (!open || (open && !tempFile)) return;

        wavesurfer.current = WaveSurfer.create({
            container: '#wavesurfer-id',
            height: 140,
            cursorWidth: 1,
            barWidth: 2,
            normalize: true,
            fillParent: true,
        })

        if (wavesurfer.current) {
            wavesurfer.current?.on('ready', () => setPlayerReady(true))
            wavesurfer.current?.on('play', () => setIsPlaying(true))
            wavesurfer.current?.on('pause', () => setIsPlaying(false))
        }
    }, [open, isRecording, tempFile])

    useEffect(() => {
        if (tempFile && wavesurfer.current) {
            wavesurfer.current?.load(tempFile)
        } else {
            wavesurfer.current = null;
            setTempFile(null);
        }
    }, [tempFile])

    const togglePlayback = () => {
        if (!isPlaying) {
            wavesurfer.current?.play()
        } else {
            wavesurfer.current?.pause()
        }
    }

    const applyMediaStream = async (id: string) => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
                deviceId: { exact: id }
            }
        });
        let context = new AudioContext();
        mediaStreamRef.current = context.createMediaStreamSource(stream) as any; // Update the ref with the new stream
    };

    const handleClickOpen = () => {
        setOpen(true);
    }

    const BlobURLToFile = async (tempFile: string) => {
        const response = await fetch(tempFile);
        const data = await response.blob();
        const metadata = { type: SETTINGS_MIC.mimeType}

        return new File([data], 'mic_recording.webm', metadata);
    }

    const handleDone = async () => {
        if (tempFile) {
            try {
                const file = await BlobURLToFile(tempFile)
                console.log({ file }, 'file', mediaBlobUrl, playerReady)

                setTempFile(null);
                setIsRecording(false);
                setOpen(false);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleCancel = () => {
        setIsRecording(false);
        setTempFile(null);
        setOpen(false);
        setSecondsRemaining(0);
    }

    const handleChange = (event: SelectChangeEvent) => {
        const id = event.target.value;
        setSelectedMic(id);

        mediaStreamRef.current = null;
        setTimeout(() => {
            applyMediaStream(id);
        }, 1000) // Fetch the new media stream for the selected microphone
    }

    const handleChangeOutput = (event: SelectChangeEvent) => {
        const id = event.target.value;
        setSelectedOut(id);
    }

    const { status, startRecording, stopRecording, mediaBlobUrl } =
        useReactMediaRecorder({
            audio: selectedMic ? { deviceId: { exact: selectedMic } } : true,
            video: false,
            customMediaStream: mediaStreamRef.current?.mediaStream,
            askPermissionOnMount: true,

        } as any);

    useEffect(() => {
        if(mediaBlobUrl) {
            setTempFile(mediaBlobUrl)
        }
    }, [mediaBlobUrl]);

    const handleStartRecording = () => {
        setTempFile(null)
        setIsRecording(true)
        startRecording()
    }

    const handleStopRecording = () => {
        setIsRecording(false);
        stopRecording();
    };

    return (
        <DivWrapper>
            {status}
            <TitleMic>Microphone Audio Output</TitleMic>
            <Fab
                color="default"
                onClick={handleClickOpen}>
                <Mic color={'secondary'} />
            </Fab>

            <Dialog open={open}>
                <DialogHeaderWrapper>
                    <DialogTitleWrapper>
                        {isRecording && (
                            <span>
                                {`Recording... ${secondsRemaining} seconds`}
                            </span>
                        )}
                        {!isRecording && tempFile && <span>Review</span>}
                        {!isRecording && !tempFile && <span>Record</span>}
                    </DialogTitleWrapper>
                    <CancelIconButtonWrapp onClick={handleCancel}>
                        <Cancel
                            style={tempFile && !isRecording ? { color: 'red' } : {}}
                        />
                    </CancelIconButtonWrapp>
                </DialogHeaderWrapper>
                <DialogContent>
                    {tempFile && <AvesurferWrapper id="wavesurfer-id" /> }
                </DialogContent>
                <DialogActionsWrapper>
                    {tempFile && (
                        <div>
                            {!isPlaying ? (
                                <IconButton onClick={togglePlayback}>
                                    <PlayArrow />
                                </IconButton>
                            ) : (
                                <IconButton onClick={togglePlayback}>
                                    <Pause />
                                </IconButton>
                            )}
                        </div>
                    )}

                    <ActionsWrapper>
                        {!isRecording && !tempFile && (
                            <IconButtonWrapper onClick={handleStartRecording}>
                                <FiberManualRecord style={{ color: 'red' }}/>
                            </IconButtonWrapper>
                        )}
                        {!isRecording && tempFile && (
                            <IconButton
                                onClick={() => {
                                    setIsRecording(false);
                                    setTempFile(null);
                                    setSecondsRemaining(0);
                            }}>
                                <Replay />
                            </IconButton>
                        )}

                        {isRecording && (
                            <IconButtonWrapper onClick={handleStopRecording}>
                                <Stop />
                            </IconButtonWrapper>
                        )}

                        {tempFile && !isRecording && (
                            <IconButton onClick={handleDone}>
                                <Done
                                    style={{ color: 'green' }} />
                            </IconButton>
                        )}
                    </ActionsWrapper>
                </DialogActionsWrapper>

                <div style={{padding: 24}}>
                    {selectedMic && (
                        <div>
                            <div style={{padding: '30px 0px'}}>Audio Input </div>
                            <FormControl key="33" fullWidth>
                                <InputLabel id="demo-input-select-label">select microphone please</InputLabel>
                                <Select
                                    labelId="demo-input-select-label"
                                    id="demo-input-select"
                                    value={selectedMic}
                                    label="input"
                                    onChange={handleChange}
                                >
                                    {audioInputArr && audioInputArr.map((device, index) => (
                                        <MenuItem key={index} value={device.deviceId}>{device.label}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    )}

                    {selectedOut && (<div>
                        <div style={{padding: '30px 0px'}}>Audio Output </div>
                        <FormControl key="ds" fullWidth>
                            <InputLabel id="demo-output-select-label">select audio output please</InputLabel>
                            <Select
                                labelId="demo-output-select-label"
                                id="demo-output-select"
                                value={selectedOut}
                                label="input"
                                onChange={handleChangeOutput}
                            >
                                {audioOutputArr && audioOutputArr.map((device, index) => (
                                    <MenuItem key={index} value={device.deviceId}>{device.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>)}
                </div>
            </Dialog>
        </DivWrapper>
    )
};

export default MicrophoneAudioOutputPage;
