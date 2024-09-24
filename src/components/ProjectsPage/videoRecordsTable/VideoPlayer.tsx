import React, { useRef, useState, useEffect } from 'react';
import {
    Checkbox,
    FormControlLabel,
    Stack,
    CircularProgress,
} from '@mui/material';
import { enqueueSnackbar } from 'notistack';

import useVirtualCamera from '../../../hook/useVirtualCamera';
import {
    updateVideoFile,
    updateVideoRecord,
} from '../../../services/Video.service';
import useReverseVideo from '../../../hook/useReverseVideo';

interface VideoPlayerProps {
    videoFileUrl: string;
    videoRecordId: string;
    projectId: string;
    onDataRefresh: (projectId: string) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
    videoFileUrl,
    videoRecordId,
    projectId,
    onDataRefresh,
}) => {
    const { setVideoSource, pauseVideo, playVideo } = useVirtualCamera({
        sceneName: 'loki',
        inputName: 'Video',
    });
    const { isFFmpegReady, initializeFFmpeg, createReversedVideo } =
        useReverseVideo(videoFileUrl);
    const [isLoopEnabled, setIsLoopEnabled] = useState(false);
    const [isReverseRequested, setIsReverseRequested] = useState(false);
    const [isVideoProcessing, setIsVideoProcessing] = useState(false);
    const videoElementRef = useRef<HTMLVideoElement>(null!);
    const currentPlaybackTime = useRef(0);

    const isReversedVideo =
        isReverseRequested || videoFileUrl.includes('reversed');
    const isReverseDisabled =
        isVideoProcessing ||
        !isFFmpegReady ||
        videoFileUrl.includes('reversed');

    useEffect(() => {
        if (crossOriginIsolated || process.env.NODE_ENV === 'development') {
            initializeFFmpeg();
        }
    }, []);

    useEffect(() => {
        if (isFFmpegReady && isReverseRequested) {
            processReverseVideo();
        }
    }, [isReverseRequested, isFFmpegReady]);

    const processReverseVideo = async () => {
        if (isFFmpegReady) {
            setIsVideoProcessing(true);
            try {
                const reversedVideoData = await createReversedVideo();

                if (reversedVideoData) {
                    const videoBlob = new Blob(
                        [
                            reversedVideoData instanceof ArrayBuffer
                                ? new Uint8Array(reversedVideoData)
                                : reversedVideoData,
                        ],
                        { type: 'video/mp4' }
                    );

                    videoElementRef.current.src =
                        URL.createObjectURL(videoBlob);

                    const reversedVideoFile = new File(
                        [videoBlob],
                        'recording-reversed.mp4',
                        {
                            type: 'video/mp4',
                        }
                    );

                    try {
                        const uploadResult = await updateVideoFile(
                            reversedVideoFile,
                            videoFileUrl
                        );
                        await updateVideoRecord(projectId, videoRecordId, {
                            videoFileUrl: uploadResult.data.videoUrl,
                        });
                        onDataRefresh(projectId);
                    } catch (error) {
                        enqueueSnackbar(
                            'Error: The reversed video file is too large to upload. Please try a shorter video.',
                            {
                                variant: 'error',
                            }
                        );
                    }
                }
            } catch (error) {
                console.error('Error processing reversed video:', error);
            } finally {
                setIsVideoProcessing(false);
            }
        }
    };

    const sendVideoToVirtualCamera = async (shouldLoop: boolean) => {
        await setVideoSource({
            url: videoFileUrl,
            loop: shouldLoop,
        });
    };

    const handleVideoPlay = async () => {
        const currentTime = videoElementRef.current.currentTime;
        const startThreshold = 0.1;

        if (currentTime < startThreshold) {
            await sendVideoToVirtualCamera(isLoopEnabled);
        } else if (
            videoElementRef.current.ended ||
            currentTime === videoElementRef.current.duration
        ) {
            videoElementRef.current.currentTime = 0;
            await sendVideoToVirtualCamera(isLoopEnabled);
        } else {
            await playVideo();
        }
    };

    const handleVideoPause = async () => {
        if (
            videoElementRef.current.currentTime !==
            videoElementRef.current.duration
        ) {
            await pauseVideo();
        }
    };

    const handleVideoEnded = () => {
        currentPlaybackTime.current = 0;
    };

    const handleTimeUpdate = (
        event: React.SyntheticEvent<HTMLVideoElement>
    ) => {
        currentPlaybackTime.current = event.currentTarget.currentTime;
    };

    const handleLoopToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsLoopEnabled(event.target.checked);
    };

    const handleReverseToggle = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setIsReverseRequested(event.target.checked);
    };

    return (
        <Stack direction="column" spacing={2}>
            <Stack direction="row" spacing={2} alignItems="center">
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isLoopEnabled}
                            onChange={handleLoopToggle}
                        />
                    }
                    label="Loop"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isReversedVideo}
                            onChange={handleReverseToggle}
                            disabled={isReverseDisabled}
                        />
                    }
                    label="Reverse"
                />
                {isVideoProcessing && <CircularProgress size={24} />}
            </Stack>
            <video
                ref={videoElementRef}
                src={videoFileUrl}
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                onEnded={handleVideoEnded}
                onTimeUpdate={handleTimeUpdate}
                crossOrigin="anonymous"
                width={320}
                height={160}
                controls
            />
        </Stack>
    );
};

export default VideoPlayer;
