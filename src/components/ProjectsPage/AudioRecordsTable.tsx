import { useState } from 'react';
import { useFormik } from 'formik';

import {
    AudioRecordsTableWrapper,
    CircularProgressWrapper,
    StyledCommentCell,
    StyledTableBody,
    StyledTableCell,
    StyledTableHead,
    StyledTextarea,
} from '../../styled/ProjectsPage.styled';
import { CustomMediaRecorder, EditAudioPopover } from '../index';
import {
    CircularProgress,
    IconButton,
    Table,
    TableContainer,
    TableRow,
    TextField,
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

import {
    IUpdateAudioRecord,
    updateAudioRecord,
    useDeleteAudioRecord,
} from '../../services/Media.service';
import { IAudioRecord, IProjects } from '../../types';
import { useAuth } from '../../Providers/AuthProvider';
import useWaveSurfer from '../../hook/useWaveSurfer';
import { UpdateAudioRecordSchema } from '../../utils/valiadtionSchema';
import ProjectTitleSearchComponent from './ProjectTitleSearchComponent';

interface IAudioRecordProps {
    audioRecords: IAudioRecord[];
    loading: boolean;
    fetchData: (projectId: string) => void;
    projectId: IProjects;
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
        stopRecording,
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
            fetchData(projectId.id);
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
                fetchData(projectId.id);
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
            <ProjectTitleSearchComponent projectName={projectId.name} />
            <TableContainer>
                <Table>
                    <StyledTableHead>
                        <TableRow>
                            <StyledTableCell>Audio name</StyledTableCell>
                            <StyledCommentCell width="400px">
                                Comment
                            </StyledCommentCell>
                            <StyledTableCell>Audio</StyledTableCell>
                            <StyledTableCell>Date</StyledTableCell>
                            {isAdmin && <StyledTableCell>Edit</StyledTableCell>}
                        </TableRow>
                    </StyledTableHead>
                    <StyledTableBody>
                        {audioRecords &&
                            (audioRecords.length === 0 ? (
                                <TableRow>
                                    <StyledTableCell colSpan={7}>
                                        No Records
                                    </StyledTableCell>
                                </TableRow>
                            ) : (
                                audioRecords.map((record) => (
                                    <TableRow key={record.id}>
                                        <StyledTableCell>
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
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {editingRecordId === record.id ? (
                                                <StyledTextarea
                                                    multiline
                                                    rows={4}
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
                                        </StyledTableCell>
                                        <StyledTableCell>
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
                                                    stopRecording={
                                                        stopRecording
                                                    }
                                                />
                                            ) : (
                                                <audio
                                                    src={record.audioFileUrl}
                                                    controls
                                                />
                                            )}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {getDate(
                                                record.date._seconds
                                            ).toString()}
                                        </StyledTableCell>
                                        {isAdmin && (
                                            <>
                                                <StyledTableCell>
                                                    {editingRecordId ===
                                                    record.id ? (
                                                        <>
                                                            <IconButton
                                                                onClick={() =>
                                                                    formik.handleSubmit()
                                                                }
                                                            >
                                                                <CheckIcon />
                                                            </IconButton>
                                                            <IconButton
                                                                onClick={
                                                                    cancelEditing
                                                                }
                                                            >
                                                                <CloseIcon />
                                                            </IconButton>
                                                        </>
                                                    ) : (
                                                        <EditAudioPopover
                                                            record={record}
                                                            startEditing={
                                                                startEditing
                                                            }
                                                            handleDeleteAudioRecord={
                                                                handleDeleteAudioRecord
                                                            }
                                                        />
                                                    )}
                                                </StyledTableCell>
                                            </>
                                        )}
                                    </TableRow>
                                ))
                            ))}
                    </StyledTableBody>
                </Table>
            </TableContainer>
        </AudioRecordsTableWrapper>
    );
};

export default AudioRecordsTable;
