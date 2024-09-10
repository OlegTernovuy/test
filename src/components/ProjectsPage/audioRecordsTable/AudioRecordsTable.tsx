import { useState } from 'react';
import { useFormik } from 'formik';

import { DataGrid, GridPaginationModel } from '@mui/x-data-grid';
import { createColumns, ProjectTitleSearchComponent } from '../../index';
import { AudioRecordsTableWrapper } from '../../../styled/AudioRecordsTable.styled';

import {
    IUpdateAudioRecord,
    updateAudioRecord,
    useDeleteAudioRecord,
} from '../../../services/Media.service';
import { IAudioRecord } from '../../../types';
import useEditingHandlers from '../../../hook/useEditingHandlers';
import useWaveSurfer from '../../../hook/useWaveSurfer';
import { useAuth } from '../../../Providers/AuthProvider';
import { UpdateAudioRecordSchema } from '../../../utils/validationSchema';

interface IAudioRecordProps {
    audioRecords: IAudioRecord[];
    loading: boolean;
    fetchData: (projectId: string) => void;
    projectId: { id: string; name: string };
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
                };
                if (mediaBlobUrl) {
                    const result = await handleUpdate(values.audioFileUrl);
                    updatedData.audioFileUrl = result;
                }
                if (values.editingRecordId) {
                    await updateAudioRecord(
                        projectId.id,
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
            await deleteAudioRecord(projectId.id, audioRecordId, audioFileUrl);
            fetchData(projectId.id);
        } catch (error) {
            console.error(error);
        }
    };

    const { apiRef, startEditing, stopEditing, cancelEditing } =
        useEditingHandlers(formik, clearBlobUrl);

    const columns = createColumns(
        isAdmin,
        startEditing,
        stopEditing,
        cancelEditing,
        handleDeleteAudioRecord,
        status,
        mediaBlobUrl,
        actionButtons,
        startRecording,
        stopRecording,
        selectedOutput
    );

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
                onCellDoubleClick={(params, event) => {
                    event.stopPropagation();
                    event.preventDefault();
                }}
                slots={{
                    toolbar: () => (
                        <ProjectTitleSearchComponent
                            projectName={projectId.name}
                        />
                    ),
                }}
            />
        </AudioRecordsTableWrapper>
    );
};

export default AudioRecordsTable;
