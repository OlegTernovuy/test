import { useState } from 'react';
import { useFormik } from 'formik';

import { ProjectTitleSearchComponent, AudioRecordRow } from '../index';
import { CircularProgressWrapper } from '../../styled/ProjectsPage.styled';
import {
    AudioRecordsTableWrapper,
    StyledCommentCell,
    StyledTableBody,
    StyledTableCell,
    StyledTableHead,
} from '../../styled/AudioRecordsTable.styled';
import {
    CircularProgress,
    Table,
    TableContainer,
    TableRow,
} from '@mui/material';

import {
    IUpdateAudioRecord,
    updateAudioRecord,
    useDeleteAudioRecord,
} from '../../services/Media.service';
import { IAudioRecord, IProjects } from '../../types';
import { useAuth } from '../../Providers/AuthProvider';
import useWaveSurfer from '../../hook/useWaveSurfer';
import { UpdateAudioRecordSchema } from '../../utils/valiadtionSchema';

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
                                    <AudioRecordRow
                                        record={record}
                                        isEditing={
                                            editingRecordId === record.id
                                        }
                                        formik={formik}
                                        startEditing={startEditing}
                                        cancelEditing={cancelEditing}
                                        status={status}
                                        mediaBlobUrl={mediaBlobUrl}
                                        actionButtons={actionButtons}
                                        startRecording={startRecording}
                                        stopRecording={stopRecording}
                                        handleDeleteAudioRecord={
                                            handleDeleteAudioRecord
                                        }
                                        isAdmin={isAdmin}
                                    />
                                ))
                            ))}
                    </StyledTableBody>
                </Table>
            </TableContainer>
        </AudioRecordsTableWrapper>
    );
};

export default AudioRecordsTable;
