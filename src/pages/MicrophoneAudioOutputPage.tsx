import React, { useState, useEffect, useRef, useMemo } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useReactMediaRecorder } from 'react-media-recorder-2';

import { Stop, PlayArrow, Pause, Replay, Mic, Done, FiberManualRecord, Cancel } from '@mui/icons-material';
import { IconButton, DialogContent, Fab, Dialog, FormControl, InputLabel, MenuItem, CircularProgress } from '@mui/material';
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
    CancelIconButtonWrapper,
    CircularProgressWrapper,
    TitleSelectWrapper
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
    const [open, setOpen] = useState(true);
    const [tempFile, setTempFile] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
    const [playerReady, setPlayerReady] = useState<boolean>(false);
    const [audioInputArr, setAudioInputArr] = useState<IDevices[]>([]);
    const [audioOutputArr, setAudioOutputArr] = useState<IDevices[]>([]);
    const [selectedMic, setSelectedMic] = useState<string>('');
    const [selectedOutput, setSelectedOutput] = useState<string>('');

    const wavesurfer = useRef<WaveSurfer | null>(null);

    const { status, startRecording, stopRecording, mediaBlobUrl } =
        useReactMediaRecorder({
            audio: selectedMic ? { deviceId: { exact: selectedMic } } : true,
            video: false,
            askPermissionOnMount: true
        });

    const isRecord = useMemo(() => {
        return (status === 'idle' || status === 'stopped') && !tempFile
    }, [status, tempFile]);

      const isRecorded = useMemo(() => {
        return status === 'stopped' && tempFile
    }, [status, tempFile]);


    useEffect(() => {
       const getAllMicrophones = async () => {
           try {
               await navigator.mediaDevices.getUserMedia({ audio: true });

               const devices = await navigator.mediaDevices.enumerateDevices();
               const audioInputArr = getMediaDevices(devices, 'audioinput');
               const audioOutputArr = getMediaDevices(devices, 'audiooutput');

               const audioInputId = audioInputArr[0].deviceId;
               const audioOutputId = audioOutputArr[0].deviceId;

               if (audioInputId) {
                   setSelectedMic(audioInputId);
               }
               if (audioOutputId) {
                   setSelectedOutput(audioOutputId);
                   wavesurfer.current?.setSinkId(audioOutputId);
               }
               setAudioInputArr(audioInputArr)
               setAudioOutputArr(audioOutputArr)
           } catch (error) {
               console.error('Error accessing media devices:', error);
           }
       }

        getAllMicrophones()
    }, []);

    useEffect(() => {
        if (status !== 'recording') {
            setSecondsRemaining(0);
            return;
        }

        const progressFn = () => {
            setSecondsRemaining(oldSecondsRemaining => {
                return oldSecondsRemaining  + 1;
            })
        }

        const timer = setInterval(progressFn, SETTINGS_MIC.timeSlice);

        return () => {
            clearInterval(timer);
        }
    }, [status])

    useEffect(() => {
        if (!open || (open && !tempFile)) return;

        wavesurfer.current = WaveSurfer.create({
            container: '#wavesurfer-id',
            height: 140,
            cursorWidth: 1,
            barWidth: 2,
            normalize: true,
            fillParent: true,
        } as any)

        if (wavesurfer.current) {
            wavesurfer.current?.on('ready', () => setPlayerReady(true))
            wavesurfer.current?.on('play', () => setIsPlaying(true))
            wavesurfer.current?.on('pause', () => setIsPlaying(false))
        }

        return () => {
            if (wavesurfer.current) {
                setIsPlaying(false)
                wavesurfer.current.destroy();
            }
        };
    }, [open, status, tempFile])

    useEffect(() => {
        if (tempFile && wavesurfer.current) {
            wavesurfer.current?.load(tempFile)
        } else {
            wavesurfer.current = null;
            setTempFile(null);
        }

        return () => {
            if (wavesurfer.current) {
                wavesurfer.current.destroy();
            }
        }
    }, [tempFile])

    const handleClickOpen = () => {
        setOpen(true);
    }

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
        if (tempFile) {
            try {
                const file = await BlobURLToFile(tempFile)
                console.log({ file }, 'file', mediaBlobUrl, playerReady)

                setTempFile(null);
                setOpen(false);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const handleCancel = () => {
        setTempFile(null);
        setOpen(false);
        setSecondsRemaining(0);
    }

    const handleChange = (event: SelectChangeEvent) => {
        const id = event.target.value;
        setSelectedMic(id);
    }

    const handleChangeOutput = (event: SelectChangeEvent) => {
        const sinkId = event.target.value;
        setSelectedOutput(sinkId);

        wavesurfer.current?.setSinkId(sinkId);
    }

    useEffect(() => {
        if(mediaBlobUrl) {
            setTempFile(mediaBlobUrl)
        }
    }, [mediaBlobUrl]);

    const handleStartRecording = () => {
        setTempFile(null)
        startRecording()
    }

    const handleStopRecording = () => {
        stopRecording();
    };

    const handleAudioOutputChange = () => {
            setTempFile(null);
            setSecondsRemaining(0);
    }

    if (!selectedMic && !selectedOutput) {
        return (
            <CircularProgressWrapper>
                <CircularProgress />
            </CircularProgressWrapper>
        )
    }

    return (
        <DivWrapper>
            <TitleMic>Microphone Audio Output</TitleMic>
            <Fab
                color="default"
                onClick={handleClickOpen}>
                <Mic color={'secondary'} />
            </Fab>

            <Dialog open={open}>
                <DialogHeaderWrapper>
                    <DialogTitleWrapper>
                        {status === 'recording' && (
                            <span>
                                {`Recording... ${secondsRemaining} seconds`}
                            </span>
                        )}
                        {isRecorded && <span>Review</span>}
                        {isRecord && <span>Record</span>}
                    </DialogTitleWrapper>
                    <CancelIconButtonWrapper onClick={handleCancel}>
                        <Cancel
                            style={{ color: 'red' }}
                        />
                    </CancelIconButtonWrapper>
                </DialogHeaderWrapper>
                <DialogContent>
                    {tempFile && <AvesurferWrapper id="wavesurfer-id" />}
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
                        {isRecord && (
                            <IconButtonWrapper onClick={handleStartRecording}>
                                <FiberManualRecord style={{ color: 'red' }}/>
                            </IconButtonWrapper>
                        )}

                        {isRecorded && (
                            <IconButton
                                onClick={handleAudioOutputChange}>
                                <Replay />
                            </IconButton>
                        )}

                        {status === 'recording' && (
                            <IconButtonWrapper $square onClick={handleStopRecording}>
                                <Stop />
                            </IconButtonWrapper>
                        )}

                        {isRecorded && (
                            <IconButton onClick={handleDone}>
                                <Done
                                    style={{ color: 'green' }} />
                            </IconButton>
                        )}
                    </ActionsWrapper>
                </DialogActionsWrapper>

                <div style={{padding: 24}}>
                    <TitleSelectWrapper>Audio Input </TitleSelectWrapper>
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

                    <TitleSelectWrapper>Audio Output </TitleSelectWrapper>
                    <FormControl key="ds" fullWidth>
                        <InputLabel id="demo-output-select-label">select audio output please</InputLabel>
                        <Select
                            labelId="demo-output-select-label"
                            id="demo-output-select"
                            value={selectedOutput}
                            label="input"
                            onChange={handleChangeOutput}
                        >
                            {audioOutputArr && audioOutputArr.map((device, index) => (
                                <MenuItem key={index} value={device.deviceId}>{device.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </Dialog>
        </DivWrapper>
    )
};

export default MicrophoneAudioOutputPage;
