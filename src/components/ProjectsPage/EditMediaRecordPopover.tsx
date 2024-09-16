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
    ConfirmMoveButton,
    OptionsWrapper,
    SelectedMoveMode,
} from '../../styled/EditMediaPopover.styled';

import {
    IAudioRecord,
    IProjects,
    IVideoRecord,
    MoveAudioRecordParams,
    MoveVideoRecordParams,
} from '../../types';

interface BasicPopoverProps<T> {
    record: IAudioRecord | IVideoRecord;
    projects: IProjects[];
    projectId: string;
    startEditing: (record: IAudioRecord | IVideoRecord) => void;
    handleDeleteRecord: (id: string, mediaFileUrl: string) => void;
    handleMoveMediaRecord: (params: T) => void;
}

const EditMediaPopover = <
    T extends MoveAudioRecordParams | MoveVideoRecordParams
>({
    record,
    projects,
    projectId,
    startEditing,
    handleDeleteRecord,
    handleMoveMediaRecord,
}: BasicPopoverProps<T>) => {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [moveMode, setMoveMode] = useState(false);
    const [selectedProject, setSelectedProject] = useState(projects[0].id);

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
            console.log('Error moving record');
            return;
        }
        const newRecord = {
            author: record.author,
            name: record.name,
            comment: record.comment,
            date: record.date,
        };

        const commonParams = {
            oldProjectId: projectId,
            newProjectId: selectedProject,
            ...(isVideo(record)
                ? {
                      videoRecordId: record.id,
                      videoRecordData: {
                          ...newRecord,
                          videoFileUrl: record.videoFileUrl,
                      },
                  }
                : {
                      audioRecordId: record.id,
                      audioRecordData: {
                          ...newRecord,
                          audioFileUrl: record.audioFileUrl,
                      },
                  }),
        };

        await handleMoveMediaRecord(commonParams as T);
        handleClose();
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <Box>
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
                <OptionsWrapper>
                    {moveMode ? (
                        <SelectedMoveMode>
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
                            <ConfirmMoveButton onClick={handleMoveConfirm}>
                                Confirm
                            </ConfirmMoveButton>
                        </SelectedMoveMode>
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
                </OptionsWrapper>
            </Popover>
        </Box>
    );
};

const isVideo = (record: IAudioRecord | IVideoRecord): record is IVideoRecord =>
    (record as IVideoRecord).videoFileUrl !== undefined;

export default EditMediaPopover;
