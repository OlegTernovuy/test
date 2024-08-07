import React, { useState, useEffect } from 'react';
import { StatusMessages } from 'react-media-recorder-2';
import {
    HeaderStyled,
} from "../../../styled/CustomMediaRecorder.styled";

const SETTINGS_MIC = {
    mimeType: 'audio/webm',
    timeSlice: 1000,
}

interface HeaderProps {
    status: StatusMessages;
    mediaBlobUrl?: string;
}

const HeaderMedia: React.FC<HeaderProps> = ({ status, mediaBlobUrl }) => {
    const [secondsRemaining, setSecondsRemaining] = useState<number>(0);

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

    return (
        <HeaderStyled>
            {status === 'recording' && (
                <span>{`Recording... ${secondsRemaining} seconds`}</span>
            )}
            {status === 'stopped' && mediaBlobUrl && <span>Review</span>}
            {status !== 'recording' && !mediaBlobUrl && <span>Record</span>}
        </HeaderStyled>
    )
};

export default HeaderMedia;
