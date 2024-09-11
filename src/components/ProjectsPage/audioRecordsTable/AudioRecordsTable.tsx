import { useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

import { DataGrid, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import {
    createColumns,
    ProjectTitleSearchComponent,
    CustomRowWrapper,
} from '../../index';
import { AudioRecordsTableWrapper } from '../../../styled/AudioRecordsTable.styled';

import {
    IUpdateAudioRecord,
    updateAudioRecord,
    useDeleteAudioRecord,
    useUpdateAudioRecordsOrder,
} from '../../../services/Media.service';
import {
    useDragAndDrop,
    useEditingHandlers,
    useWaveSurfer,
} from '../../../hook';
import { useAuth } from '../../../Providers/AuthProvider';
import { IAudioRecord } from '../../../types';
import { UpdateAudioRecordSchema } from '../../../utils/validationSchema';

interface IAudioRecordProps {
    audioRecords: IAudioRecord[];
    loading: boolean;
    fetchData: (projectId: string) => void;
    onReorder: (reorderedAudioRecords: IAudioRecord[]) => void;
    projectId: { id: string; name: string };
}

const AudioRecordsTable = ({
    audioRecords,
    loading,
    fetchData,
    onReorder,
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
            pageSize: 30,
            page: 0,
        }
    );

    const [sortModel, setSortModel] = useState<GridSortModel>([]);
    const isAnyColumnSorted = useMemo(() => sortModel.length > 0, [sortModel]);

    const handleSortModelChange = (newSortModel: GridSortModel) => {
        setSortModel(newSortModel);
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

    const { updateAudioRecordsOrder, loading: audioRecordsOrderLoading } =
        useUpdateAudioRecordsOrder();

    const handleDeleteAudioRecord = async (
        audioRecordId: string,
        audioFileUrl: string
    ) => {
        try {
            await deleteAudioRecord(projectId.id, audioRecordId, audioFileUrl);
            await fetchData(projectId.id);
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

    const onDragEnd = useDragAndDrop<IAudioRecord>({
        items: audioRecords,
        onReorder,
        updateOrder: updateAudioRecordsOrder,
        fetchData,
        projectId: projectId.id,
    });

    return (
        <AudioRecordsTableWrapper>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable-table-list">
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            <DataGrid
                                apiRef={apiRef}
                                columns={columns}
                                rows={audioRecords}
                                autoHeight
                                getRowId={(row) => row.id}
                                sortModel={sortModel}
                                onSortModelChange={handleSortModelChange}
                                loading={
                                    loading ||
                                    formik.isSubmitting ||
                                    deleteLoading ||
                                    audioRecordsOrderLoading
                                }
                                editMode="row"
                                getRowHeight={() => 'auto'}
                                getEstimatedRowHeight={() => 200}
                                paginationModel={paginationModel}
                                onPaginationModelChange={setPaginationModel}
                                pageSizeOptions={[30, 75, 100]}
                                disableRowSelectionOnClick
                                onCellDoubleClick={(_, event) => {
                                    event.stopPropagation();
                                    event.preventDefault();
                                }}
                                disableColumnSorting={!isAdmin}
                                disableColumnMenu={!isAdmin}
                                slots={{
                                    toolbar: () => (
                                        <ProjectTitleSearchComponent
                                            projectName={projectId.name}
                                        />
                                    ),
                                    row:
                                        isAdmin && !isAnyColumnSorted
                                            ? CustomRowWrapper
                                            : undefined,
                                }}
                            />
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </AudioRecordsTableWrapper>
    );
};

export default AudioRecordsTable;
