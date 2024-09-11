import { useState } from 'react';

import { Box, IconButton, Popover } from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';

import { IAudioRecord, IVideoRecord } from '../types';

interface BasicPopoverProps {
    record: IAudioRecord | IVideoRecord;
    startEditing: (record: IAudioRecord | IVideoRecord) => void;
    handleDeleteRecord: (id: string, mediaFileUrl: string) => void;
}

const EditMediaPopover = ({
    record,
    startEditing,
    handleDeleteRecord,
}: BasicPopoverProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <div>
            <IconButton aria-describedby={id} onClick={handleClick}>
                <MoreVertIcon />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
            >
                <Box>
                    <IconButton onClick={() => startEditing(record)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        onClick={() =>
                            handleDeleteRecord(
                                record.id,
                                isVideo(record)
                                    ? record.videoFileUrl
                                    : record.audioFileUrl
                            )
                        }
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>
            </Popover>
        </div>
    );
};

const isVideo = (record: IAudioRecord | IVideoRecord): record is IVideoRecord =>
    (record as IVideoRecord).videoFileUrl !== undefined;

export default EditMediaPopover;
