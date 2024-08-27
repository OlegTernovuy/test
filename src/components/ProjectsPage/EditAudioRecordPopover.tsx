import { useState } from 'react';

import { Box, IconButton, Popover } from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';

import { IAudioRecord } from '../../types';

interface BasicPopoverProps {
    record: IAudioRecord;
    startEditing: (record: IAudioRecord) => void;
    handleDeleteAudioRecord: (id: string, audioFileUrl: string) => void;
}

const EditAudioPopover = ({
    record,
    startEditing,
    handleDeleteAudioRecord,
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
                sx={{
                    '& .MuiPaper-root': {
                        backgroundColor: 'transparent',
                    },
                }}
            >
                <Box>
                    <IconButton onClick={() => startEditing(record)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton
                        onClick={() =>
                            handleDeleteAudioRecord(
                                record.id,
                                record.audioFileUrl
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

export default EditAudioPopover;
