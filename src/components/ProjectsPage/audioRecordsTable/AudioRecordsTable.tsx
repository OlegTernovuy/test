import { useMemo, useState } from 'react';
import { useFormik } from 'formik';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

import { DataGrid, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import {
    createAudioColumns,
    ProjectTitleSearchComponent,
    CustomRowWrapper,
} from '../../index';
import { AudioRecordsTableWrapper } from '../../../styled/AudioRecordsTable.styled';

import {
    IUpdateAudioRecord,
    updateAudioRecord,
    useDeleteAudioRecord,
    useMoveAudioRecords,
    useUpdateAudioRecordsOrder,
} from '../../../services/Audio.service';
import {
    useDragAndDrop,
    useEditingHandlers,
    useWaveSurfer,
} from '../../../hook';
import { useAuth } from '../../../Providers/AuthProvider';
import { IAudioRecord, IProjects, MoveAudioRecordParams } from '../../../types';
import { UpdateAudioRecordSchema } from '../../../utils/validationSchema';

interface IAudioRecordProps {
    audioRecords: IAudioRecord[];
    loading: boolean;
    fetchData: (projectId: string) => void;
    onReorder: (reorderedAudioRecords: IAudioRecord[]) => void;
    projectId: { id: string; name: string };
    projects?: IProjects[];
}

const AudioRecordsTable = ({
    audioRecords,
    loading,
    fetchData,
    onReorder,
    projectId,
    projects,
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
    const { updateAudioRecordsOrder, loading: audioRecordsOrderLoading } =
        useUpdateAudioRecordsOrder();
    const { moveAudioRecords, loading: moveAudioLoading } =
        useMoveAudioRecords();

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

    const handleMoveAudioRecord = async ({
        oldProjectId,
        newProjectId,
        audioRecordId,
        audioRecordData,
    }: MoveAudioRecordParams) => {
        try {
            await moveAudioRecords(
                oldProjectId,
                newProjectId,
                audioRecordId,
                audioRecordData
            );
            await fetchData(projectId.id);
        } catch (error) {
            console.error(error);
        }
    };

    const { apiRef, startEditing, stopEditing, cancelEditing } =
        useEditingHandlers(formik, clearBlobUrl);

    const columns = createAudioColumns(
        isAdmin,
        startEditing,
        stopEditing,
        cancelEditing,
        handleDeleteAudioRecord,
        handleMoveAudioRecord,
        status,
        mediaBlobUrl,
        actionButtons,
        startRecording,
        stopRecording,
        selectedOutput,
        projects ?? [],
        projectId.id
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
                                    audioRecordsOrderLoading ||
                                    moveAudioLoading
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
