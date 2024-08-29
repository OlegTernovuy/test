import { useState } from 'react';
import { useFormik } from 'formik';
import { CircularProgressWrapper } from '../../../styled/ProjectsPage.styled';
import { CircularProgress, TextField } from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridRenderCellParams,
} from '@mui/x-data-grid';
import {
    IUpdateAudioRecord,
    updateAudioRecord,
    useDeleteAudioRecord,
} from '../../../services/Media.service';
import { IAudioRecord, IProjects } from '../../../types';
import { useAuth } from '../../../Providers/AuthProvider';
import useWaveSurfer from '../../../hook/useWaveSurfer';
import { UpdateAudioRecordSchema } from '../../../utils/valiadtionSchema';
import { AudioRecordsTableWrapper } from '../../../styled/AudioRecordsTable.styled';
import CustomMediaRecorder from '../../CustomMediaRecorder/CustomMediaRecorder';
import ProjectTitleSearchComponent from '../ProjectTitleSearchComponent';
import EditAudioPopover from './EditAudioRecordPopover';

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
        clearBlobUrl,
    } = useWaveSurfer();

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
                if (editingRecordId) {
                    await updateAudioRecord(editingRecordId, updatedData);
                    setEditingRecordId(null);
                    fetchData(projectId.id);
                }
            } catch (error) {
                console.error('Error submitting the form: ', error);
            } finally {
                setSubmitting(false);
            }
        },
    });

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

    const startEditing = (record: IAudioRecord) => {
        clearBlobUrl();
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

    const getDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US');
    };

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Audio name',
            flex: 1,
            // editable: true,
            renderCell: (params: GridRenderCellParams) =>
                editingRecordId === params.row.id ? (
                    <TextField
                        size="small"
                        value={formik.values.name}
                        onChange={(e) =>
                            formik.setFieldValue('name', e.target.value)
                        }
                    />
                ) : (
                    params.row.name
                ),
        },
        {
            field: 'comment',
            headerName: 'Comment',
            flex: 1,
            renderCell: (params: GridRenderCellParams) =>
                editingRecordId === params.row.id ? (
                    <TextField
                        size="small"
                        multiline
                        value={formik.values.comment}
                        onChange={(e) =>
                            formik.setFieldValue('comment', e.target.value)
                        }
                    />
                ) : (
                    params.row.comment
                ),
        },
        {
            field: 'audio',
            headerName: 'Audio',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => (
                <CustomMediaRecorder
                    status={status}
                    mediaBlobUrl={mediaBlobUrl}
                    actionButtons={actionButtons}
                    startRecording={startRecording}
                    stopRecording={stopRecording}
                />
            ),
        },
        {
            field: 'date',
            headerName: 'Date',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => {
                const date = (params.value as { _seconds: number })?._seconds;
                return date ? getDate(date) : ''; // Fallback if date is undefined
            },
        },
        ...(isAdmin
            ? [
                  {
                      field: 'actions',
                      headerName: 'Actions',
                      flex: 1,
                      renderCell: (params: GridRenderCellParams) =>
                          editingRecordId === params.row.id ? (
                              <>
                                  <GridActionsCellItem
                                      icon={<CheckIcon />}
                                      label="Save"
                                      onClick={() => formik.handleSubmit()}
                                  />
                                  <GridActionsCellItem
                                      icon={<CloseIcon />}
                                      label="Cancel"
                                      onClick={cancelEditing}
                                  />
                              </>
                          ) : (
                              <EditAudioPopover
                                  record={params.row}
                                  startEditing={() => startEditing(params.row)}
                                  handleDeleteAudioRecord={() =>
                                      handleDeleteAudioRecord(
                                          params.row.id,
                                          params.row.audioFileUrl
                                      )
                                  }
                              />
                          ),
                  },
              ]
            : []),
    ];

    return (
        <AudioRecordsTableWrapper>
            {(loading || formik.isSubmitting || deleteLoading) && (
                <CircularProgressWrapper>
                    <CircularProgress />
                </CircularProgressWrapper>
            )}
            <ProjectTitleSearchComponent projectName={projectId.name} />
            <DataGrid
                rows={audioRecords}
                columns={columns}
                autoHeight
                getRowId={(row) => row.id}
                loading={loading}
                editMode="row"
                rowHeight={200}
                disableRowSelectionOnClick
            />
        </AudioRecordsTableWrapper>
    );
};

export default AudioRecordsTable;
