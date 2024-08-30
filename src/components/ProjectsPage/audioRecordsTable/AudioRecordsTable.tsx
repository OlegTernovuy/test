import { useState } from 'react';
import { useFormik } from 'formik';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import {
    DataGrid,
    GridActionsCellItem,
    GridColDef,
    GridPaginationModel,
    GridRenderCellParams,
    useGridApiRef,
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
import AudioPlayerComponent from './AudioPlayerComponent';

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
        selectedOutput,
    } = useWaveSurfer('#wavesurfer-edit');

    const { deleteAudioRecord, loading: deleteLoading } =
        useDeleteAudioRecord();
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(
        {
            pageSize: 5,
            page: 0,
        }
    );

    const startEditingMultipleFields = (id: string, fields: string[]) => {
        fields.forEach((field) => {
            apiRef.current.startCellEditMode({ id, field });
        });
    };

    const stopEditingMultipleFields = (id: string, fields: string[]) => {
        fields.forEach((field) => {
            apiRef.current.stopCellEditMode({ id, field });
        });
    };

    const cancelEditingMultipleFields = (id: string, fields: string[]) => {
        fields.forEach((field) => {
            apiRef.current.setEditCellValue(
                { id, field, value: null },
                { debounceMs: 200 }
            );
            apiRef.current.stopCellEditMode({
                id,
                field,
                ignoreModifications: true,
            });
        });
    };

    const apiRef = useGridApiRef();

    const startEditing = (id: string) => {
        clearBlobUrl();
        startEditingMultipleFields(id, ['name', 'comment', 'audio', 'actions']);
    };

    const stopEditing = async (id: string) => {
        stopEditingMultipleFields(id, ['name', 'comment', 'audio', 'actions']);
    };

    const cancelEditing = (id: string) => {
        cancelEditingMultipleFields(id, [
            'name',
            'comment',
            'audio',
            'actions',
        ]);
    };

    const formik = useFormik({
        initialValues: {
            editingRecordId: '',
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
                if (values.editingRecordId) {
                    await updateAudioRecord(
                        values.editingRecordId,
                        updatedData
                    );
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

    const getDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('en-US');
    };

    const columns: GridColDef[] = [
        {
            field: 'name',
            headerName: 'Audio name',
            flex: 1,
            headerAlign: 'center',
            align: 'center',
            editable: true,
            renderCell: (params: GridRenderCellParams) => params.row.name,
        },
        {
            field: 'comment',
            headerName: 'Comment',
            flex: 2,
            headerAlign: 'center',
            align: 'center',
            editable: true,
            renderCell: (params: GridRenderCellParams) => params.row.comment,
        },
        {
            field: 'audio',
            headerName: 'Audio',
            headerAlign: 'center',
            align: 'center',
            flex: 2,
            editable: true,
            renderCell: (params: GridRenderCellParams) => (
                <AudioPlayerComponent
                    audioUrl={params.row.audioFileUrl}
                    selectedOutput={selectedOutput}
                />
            ),
            renderEditCell: (params: GridRenderCellParams) => (
                <CustomMediaRecorder
                    status={status}
                    mediaBlobUrl={mediaBlobUrl}
                    actionButtons={actionButtons}
                    startRecording={startRecording}
                    stopRecording={stopRecording}
                    wavesurferId="wavesurfer-edit"
                />
            ),
        },
        {
            field: 'date',
            headerName: 'Date',
            headerAlign: 'center',
            align: 'center',
            flex: 1,
            renderCell: (params: GridRenderCellParams) => {
                const date = (params.value as { _seconds: number })?._seconds;
                return date ? getDate(date) : '';
            },
        },
        ...(isAdmin
            ? [
                  {
                      field: 'actions',
                      headerName: 'Actions',
                      //   headerAlign: 'center',
                      //   align: 'center',
                      editable: true,
                      flex: 0.5,
                      renderCell: (params: GridRenderCellParams) => (
                          <EditAudioPopover
                              record={params.row}
                              startEditing={() => startEditing(params.row.id)}
                              handleDeleteAudioRecord={() =>
                                  handleDeleteAudioRecord(
                                      params.row.id,
                                      params.row.audioFileUrl
                                  )
                              }
                          />
                      ),
                      renderEditCell: (params: GridRenderCellParams) => (
                          <>
                              <GridActionsCellItem
                                  icon={<CheckIcon />}
                                  label="Save"
                                  onClick={() => stopEditing(params.row.id)}
                              />
                              <GridActionsCellItem
                                  icon={<CloseIcon />}
                                  label="Cancel"
                                  onClick={() => cancelEditing(params.row.id)}
                              />
                          </>
                      ),
                  },
              ]
            : []),
    ];

    const handleRowEditProcess = async (newRow: any) => {
        console.log('newRow', newRow);

        formik.setValues({
            editingRecordId: newRow.id,
            name: newRow.name,
            author: newRow.author,
            comment: newRow.comment,
            audioFileUrl: newRow.audioFileUrl,
        });

        await formik.validateForm();

        if (formik.isValid) {
            await formik.handleSubmit();
        }

        return newRow;
    };

    return (
        <AudioRecordsTableWrapper>
            <DataGrid
                apiRef={apiRef}
                rows={audioRecords}
                columns={columns}
                autoHeight
                getRowId={(row) => row.id}
                loading={loading || formik.isSubmitting || deleteLoading}
                editMode="row"
                getRowHeight={() => 'auto'}
                getEstimatedRowHeight={() => 200}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10, 20]}
                disableRowSelectionOnClick
                // processRowUpdate={handleRowEditProcess} // Use processRowUpdate for handling updates
                onCellEditStop={(params, event) => {
                    stopEditing(params.row.id);
                    handleRowEditProcess(params.row);
                }}
                // experimentalFeatures={{ newEditingApi: true }}
                // processRowUpdate={(updatedRow, originalRow) =>
                //     handleRowEditProcess(updatedRow)
                // }
                slots={{
                    toolbar: () => (
                        <ProjectTitleSearchComponent
                            projectName={projectId.name}
                        />
                    ),
                }}
                sx={{
                    '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
                        py: '15px',
                    },
                }}
            />
        </AudioRecordsTableWrapper>
    );
};

export default AudioRecordsTable;
