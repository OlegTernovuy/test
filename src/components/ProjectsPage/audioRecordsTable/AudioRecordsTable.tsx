import { useState } from 'react';
import { useFormik } from 'formik';

import { createAudioColumns, MediaTable } from '../../index';

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

//test 1

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

     const [selectedAudioId, setSelectedAudioId] = useState<string | null>(null);

    const handleSelectAudio = (id: string) => {
        setSelectedAudioId((prevId) => (prevId === id ? null : id));
    };
    

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
        projectId.id,
        selectedAudioId,
        handleSelectAudio
    );

    const onDragEnd = useDragAndDrop<IAudioRecord>({
        items: audioRecords,
        onReorder,
        updateOrder: updateAudioRecordsOrder,
        fetchData,
        projectId: projectId.id,
    });

    const isLoading =
        loading ||
        formik.isSubmitting ||
        deleteLoading ||
        audioRecordsOrderLoading ||
        moveAudioLoading;

    return (
        <MediaTable
            onDragEnd={onDragEnd}
            apiRef={apiRef}
            mediaRecords={audioRecords}
            columns={columns}
            projectName={projectId.name}
            isLoading={isLoading}
        />
    );
};

export default AudioRecordsTable;
