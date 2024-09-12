import { useState } from 'react';

import {
    Box,
    Button,
    FormControl,
    IconButton,
    InputLabel,
    NativeSelect,
    Popover,
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';

import {
    IAudioRecord,
    IProjects,
    IVideoRecord,
    MoveAudioRecordParams,
} from '../types';

interface BasicPopoverProps {
    record: IAudioRecord | IVideoRecord;
    projects?: IProjects[];
    projectId?: string;
    startEditing: (record: IAudioRecord | IVideoRecord) => void;
    handleDeleteRecord: (id: string, mediaFileUrl: string) => void;
    handleMoveAudioRecord?: (params: MoveAudioRecordParams) => void;
}

const EditMediaPopover = ({
    record,
    projects,
    projectId,
    startEditing,
    handleDeleteRecord,
    handleMoveAudioRecord,
}: BasicPopoverProps) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [moveMode, setMoveMode] = useState(false);
    const [selectedProject, setSelectedProject] = useState(() =>
        projects && projects.length > 0 ? projects[0].id : null
    );

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setMoveMode(false);
    };

    const handleMoveClick = () => {
        setMoveMode(true);
    };

    const handleSelectedProject = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setSelectedProject(event.target.value as string);
    };

    const handleMoveConfirm = async () => {
        if (selectedProject === projectId) {
            console.log('Error moving project');
            return;
        }
        if (isVideo(record)) {
            return;
        }
        const newRecord = {
            date: record.date,
            author: record.author,
            name: record.name,
            comment: record.comment,
            audioFileUrl: record.audioFileUrl,
        };
        if (handleMoveAudioRecord && selectedProject && projectId)
            await handleMoveAudioRecord({
                oldProjectId: projectId,
                newProjectId: selectedProject,
                audioRecordId: record.id,
                audioRecordData: newRecord,
            });
        handleClose();
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
                    horizontal: moveMode ? -50 : 'left',
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {moveMode ? (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '4px',
                            }}
                        >
                            <FormControl fullWidth>
                                <InputLabel variant="standard">
                                    Project
                                </InputLabel>
                                <NativeSelect
                                    size="small"
                                    value={selectedProject}
                                    onChange={handleSelectedProject}
                                >
                                    {projects?.map((project) => (
                                        <option
                                            key={project.id}
                                            value={project.id}
                                        >
                                            {project.id}
                                        </option>
                                    ))}
                                </NativeSelect>
                            </FormControl>
                            <Button
                                sx={{ marginTop: 1 }}
                                onClick={handleMoveConfirm}
                            >
                                Confirm
                            </Button>
                        </Box>
                    ) : (
                        <>
                            <Button onClick={() => startEditing(record)}>
                                Edit
                            </Button>
                            <Button onClick={handleMoveClick}>Move</Button>
                            <Button
                                onClick={() =>
                                    handleDeleteRecord(
                                        record.id,
                                        isVideo(record)
                                            ? record.videoFileUrl
                                            : record.audioFileUrl
                                    )
                                }
                            >
                                Delete
                            </Button>
                        </>
                    )}
                </Box>
            </Popover>
        </div>
    );
};

const isVideo = (record: IAudioRecord | IVideoRecord): record is IVideoRecord =>
    (record as IVideoRecord).videoFileUrl !== undefined;

export default EditMediaPopover;
