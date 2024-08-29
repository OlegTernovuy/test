import {
    EditAudioPopover,
    EditableTableCell,
    EditableCommentCell,
    CustomMediaRecorder,
    AudioPlayerComponent,
} from '../index';
import { StyledTableCell } from '../../styled/AudioRecordsTable.styled';
import { TableRow, IconButton } from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

import { CustomIconButtonProps, IAudioRecord } from '../../types';

interface AudioRecordRowProps {
    record: IAudioRecord;
    isEditing: boolean;
    formik: any;
    startEditing: (record: IAudioRecord) => void;
    cancelEditing: () => void;
    status: any;
    mediaBlobUrl?: string;
    selectedOutput: string;
    actionButtons: CustomIconButtonProps[];
    startRecording: () => void;
    stopRecording: () => void;
    handleDeleteAudioRecord: (id: string, url: string) => void;
    isAdmin: boolean;
}

const AudioRecordRow = ({
    record,
    isEditing,
    formik,
    startEditing,
    cancelEditing,
    status,
    mediaBlobUrl,
    selectedOutput,
    actionButtons,
    startRecording,
    stopRecording,
    handleDeleteAudioRecord,
    isAdmin,
}: AudioRecordRowProps) => {
    const getDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        const formattedDate = date.toLocaleDateString('en-US');
        return formattedDate;
    };
    return (
        <TableRow>
            <StyledTableCell>
                <EditableTableCell
                    isEditing={isEditing}
                    editValue={formik.values.name}
                    value={record.name}
                    name="name"
                    onChange={formik.handleChange}
                />
            </StyledTableCell>
            <StyledTableCell>
                <EditableCommentCell
                    isEditing={isEditing}
                    editValue={formik.values.comment}
                    value={record.comment}
                    name="comment"
                    onChange={formik.handleChange}
                />
            </StyledTableCell>
            <StyledTableCell>
                {isEditing ? (
                    <CustomMediaRecorder
                        status={status}
                        mediaBlobUrl={mediaBlobUrl}
                        actionButtons={actionButtons}
                        startRecording={startRecording}
                        stopRecording={stopRecording}
                    />
                ) : (
                    <AudioPlayerComponent
                        audioUrl={record.audioFileUrl}
                        selectedOutput={selectedOutput}
                    />
                )}
            </StyledTableCell>
            <StyledTableCell>{getDate(record.date._seconds)}</StyledTableCell>
            {isAdmin && (
                <StyledTableCell>
                    {isEditing ? (
                        <>
                            <IconButton onClick={() => formik.handleSubmit()}>
                                <CheckIcon />
                            </IconButton>
                            <IconButton onClick={cancelEditing}>
                                <CloseIcon />
                            </IconButton>
                        </>
                    ) : (
                        <EditAudioPopover
                            record={record}
                            startEditing={startEditing}
                            handleDeleteAudioRecord={handleDeleteAudioRecord}
                        />
                    )}
                </StyledTableCell>
            )}
        </TableRow>
    );
};

export default AudioRecordRow;
