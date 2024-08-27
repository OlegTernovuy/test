import { useState } from 'react';
import { useFormik } from 'formik';

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
    IUpdateAudioRecord,
    updateAudioRecord,
    useDeleteAudioRecord,
} from '../../services/Media.service';
import { IAudioRecord } from '../../types';
import { useAuth } from '../../Providers/AuthProvider';
import useWaveSurfer from '../../hook/useWaveSurfer';
import { UpdateAudioRecordSchema } from '../../utils/valiadtionSchema';

interface IAudioRecordProps {
    audioRecords: IAudioRecord[];
    loading: boolean;
    fetchData: (projectId: string) => void;
    projectId: string;
}

const AudioRecordsTable = ({
    audioRecords,
    loading,
    fetchData,
    projectId,
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
            await deleteAudioRecord(audioRecordId, audioFileUrl);
            fetchData(projectId);
        } catch (error) {
            console.error(error);
        }
    };

    const { deleteAudioRecord, loading: deleteLoading } =
        useDeleteAudioRecord();

    const [editingRecordId, setEditingRecordId] = useState<string | null>(null);

    const formik = useFormik({
        initialValues: {
            name: '',
            comment: '',
            author: '',
            audioFileUrl: '',
        },
        validationSchema: UpdateAudioRecordSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                let updatedData: IUpdateAudioRecord = {
                    name: values.name,
                    comment: values.comment,
                    author: values.author,
                };
                if (mediaBlobUrl) {
                    const result = await handleUpdate(values.audioFileUrl);
                    updatedData.audioFileUrl = result;
                }
                if (editingRecordId)
                    await updateAudioRecord(editingRecordId, updatedData);
                setEditingRecordId(null);
                fetchData(projectId);
            } catch (error) {
                console.error('Error submitting the form: ', error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const startEditing = (record: IAudioRecord) => {
        setEditingRecordId(record.id);
        formik.setValues({
            name: record.name,
            author: record.author,
            comment: record.comment,
            audioFileUrl: record.audioFileUrl,
        });
    };

    const cancelEditing = () => {
        setEditingRecordId(null);
    };

    return (
        <AudioRecordsTableWrapper>
            {(loading || formik.isSubmitting || deleteLoading) && (
                <CircularProgressWrapper>
                    <CircularProgress />
                </CircularProgressWrapper>
            )}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Audio name</TableCell>
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
                                            {editingRecordId === record.id ? (
                                                <TextField
                                                    size="small"
                                                    name="name"
                                                    value={formik.values.name}
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                />
                                            ) : (
                                                record.name
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editingRecordId === record.id ? (
                                                <TextField
                                                    size="small"
                                                    name="comment"
                                                    value={
                                                        formik.values.comment
                                                    }
                                                    onChange={
                                                        formik.handleChange
                                                    }
                                                />
                                            ) : (
                                                record.comment
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {editingRecordId === record.id ? (
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
                                                    {editingRecordId ===
                                                    record.id ? (
                                                        <>
                                                            <IconButton
                                                                onClick={() =>
                                                                    formik.handleSubmit()
                                                                }
                                                            >
                                                                <SaveIcon
                                                                    fontSize="small"
                                                                    color="primary"
                                                                />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={
                                                                    cancelEditing
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
