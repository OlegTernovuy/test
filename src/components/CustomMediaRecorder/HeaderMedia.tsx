import React from 'react';
import { StatusMessages } from 'react-media-recorder-2';

import { HeaderStyled } from '../../styled/CustomMediaRecorder.styled';

interface HeaderProps {
    status: StatusMessages;
    mediaBlobUrl?: string;
}

const HeaderMedia: React.FC<HeaderProps> = ({ status, mediaBlobUrl }) => {
    return (
        <HeaderStyled>
            {status === 'recording' && (
                <span>{`Recording...`}</span>
            )}
            {status === 'stopped' && mediaBlobUrl && <span>Review</span>}
            {status !== 'recording' && !mediaBlobUrl && <span>Record</span>}
        </HeaderStyled>
    )
};

export default HeaderMedia;
