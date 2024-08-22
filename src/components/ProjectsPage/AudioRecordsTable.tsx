import { useState } from 'react';

import {
    AudioRecordsTableWrapper,
    CircularProgressWrapper,
} from '../../styled/ProjectsPage.styled';
import { CustomMediaRecorder } from '../index';
import {
    CircularProgress,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

import {
    deleteAudioFile,
    deleteAudioRecord,
    IUpdateAudioRecord,
    updateAudioRecord,
} from '../../services/Media.service';
import { IAudioRecord } from '../../types';
import { useAuth } from '../../Providers/AuthProvider';
import useWaveSurfer from '../../hook/useWaveSurfer';

interface IAudioRecordProps {
    audioRecords: IAudioRecord[];
    loading: boolean;
    fetchData: () => void;
}

const AudioRecordsTable = ({
    audioRecords,
    loading,
    fetchData,
}: IAudioRecordProps) => {
    const { isAdmin } = useAuth();
    const {
        status,
        mediaBlobUrl,
        actionButtons,
        startRecording,
        handleUpdate,
    } = useWaveSurfer();

    const getDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        const formattedDate = date.toLocaleDateString('en-US');
        return formattedDate;
    };

    const handleDeleteAudioRecord = async (
        audioRecordId: string,
        audioFileUrl: string
    ) => {
        try {
            await deleteAudioRecord(audioRecordId);
            await deleteAudioFile(audioFileUrl);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const [editingRecord, setEditingRecord] = useState<IAudioRecord | null>(
        null
    );
    const [editedData, setEditedData] = useState<IAudioRecord | null>(null);

    const startEditing = (record: IAudioRecord) => {
        setEditingRecord(record);
        setEditedData(record);
    };

    const handleSave = async () => {
        if (editedData) {
            try {
                let updatedData: IUpdateAudioRecord = {
                    name: editedData.name,
                    comment: editedData.comment,
                    author: editedData.author,
                };

                if (mediaBlobUrl) {
                    const result = await handleUpdate(editedData.audioFileUrl);
                    updatedData.audioFileUrl = result;
                }

                await updateAudioRecord(editedData.id, updatedData);
                setEditingRecord(null);
                fetchData();
            } catch (error) {
                console.error('Error updating record:', error);
            }
        }
    };

    const handleCancel = () => {
        setEditingRecord(null);
        setEditedData(null);
    };

    return (
        <AudioRecordsTableWrapper>
            {loading && (
                <CircularProgressWrapper>
                    <CircularProgress />
                </CircularProgressWrapper>
            )}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Audio name</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Project</TableCell>
                            <TableCell>Comment</TableCell>
                            <TableCell>Audio</TableCell>
                            <TableCell>Date</TableCell>
                            {isAdmin && (
                                <>
                                    <TableCell>Edit</TableCell>
                                    <TableCell>Delete</TableCell>
                                </>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {audioRecords &&
                            (audioRecords.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        No Records
                                    </TableCell>
                                </TableRow>
                            ) : (
                                audioRecords.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell>
                                            {editingRecord?.id === record.id ? (
                                                <TextField
                                                    size="small"
                                                    value={
                                                        editedData?.name || ''
                                                    }
                                                    onChange={(e) =>
                                                        setEditedData(
                                                            (prev) => ({
                                                                ...prev!,
                                                                name: e.target
                                                                    .value,
                                                            })
                                                        )
                                                    }
                                                />
                                            ) : (
                                                record.name
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editingRecord?.id === record.id ? (
                                                <TextField
                                                    size="small"
                                                    value={
                                                        editedData?.author || ''
                                                    }
                                                    onChange={(e) =>
                                                        setEditedData(
                                                            (prev) => ({
                                                                ...prev!,
                                                                author: e.target
                                                                    .value,
                                                            })
                                                        )
                                                    }
                                                />
                                            ) : (
                                                record.author
                                            )}
                                        </TableCell>
                                        <TableCell>{record.project}</TableCell>
                                        <TableCell>
                                            {editingRecord?.id === record.id ? (
                                                <TextField
                                                    size="small"
                                                    value={
                                                        editedData?.comment ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        setEditedData(
                                                            (prev) => ({
                                                                ...prev!,
                                                                comment:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                />
                                            ) : (
                                                record.comment
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editingRecord?.id === record.id ? (
                                                <CustomMediaRecorder
                                                    status={status}
                                                    mediaBlobUrl={mediaBlobUrl}
                                                    actionButtons={
                                                        actionButtons
                                                    }
                                                    startRecording={
                                                        startRecording
                                                    }
                                                />
                                            ) : (
                                                <audio
                                                    src={record.audioFileUrl}
                                                    controls
                                                />
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {getDate(
                                                record.date._seconds
                                            ).toString()}
                                        </TableCell>
                                        {isAdmin && (
                                            <>
                                                <TableCell>
                                                    {editingRecord?.id ===
                                                    record.id ? (
                                                        <>
                                                            <IconButton
                                                                onClick={
                                                                    handleSave
                                                                }
                                                            >
                                                                <SaveIcon
                                                                    fontSize="small"
                                                                    color="primary"
                                                                />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={
                                                                    handleCancel
                                                                }
                                                            >
                                                                <CancelIcon
                                                                    fontSize="small"
                                                                    color="secondary"
                                                                />
                                                            </IconButton>
                                                        </>
                                                    ) : (
                                                        <IconButton
                                                            onClick={() =>
                                                                startEditing(
                                                                    record
                                                                )
                                                            }
                                                        >
                                                            <EditIcon
                                                                fontSize="small"
                                                                color="primary"
                                                            />
                                                        </IconButton>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={() => {
                                                            handleDeleteAudioRecord(
                                                                record.id,
                                                                record.audioFileUrl
                                                            );
                                                        }}
                                                    >
                                                        <DeleteIcon
                                                            fontSize="small"
                                                            color="primary"
                                                        />
                                                    </IconButton>
                                                </TableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </AudioRecordsTableWrapper>
    );
};

export default AudioRecordsTable;
