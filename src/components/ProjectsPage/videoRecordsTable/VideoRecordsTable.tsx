import { useCallback, useEffect, useRef } from 'react';
import { useFormik } from 'formik';

import { createVideoColumns, MediaTable } from '../../';

import {
    IUpdateVideoRecord,
    updateVideoRecord,
    useDeleteVideoRecord,
    useMoveVideoRecords,
    useUpdateVideoRecordsOrder,
} from '../../../services/Video.service';
import {
    useDragAndDrop,
    useVideoEditingHandlers,
    useVideoRecorder,
} from '../../../hook';
import { IProjects, IVideoRecord, MoveVideoRecordParams } from '../../../types';
import { UpdateVideoRecordSchema } from '../../../utils/validationSchema';
import { useAuth } from '../../../Providers/AuthProvider';

interface IVideoRecordProps {
    videoRecords: IVideoRecord[];
    loading: boolean;
    fetchData: (projectId: string) => void;
    onReorder: (reorderedVideoRecords: IVideoRecord[]) => void;
    projectId: { id: string; name: string };
    projects: IProjects[];
}

const VideoRecordsTable = ({
    videoRecords,
    loading,
    fetchData,
    onReorder,
    projectId,
    projects,
}: IVideoRecordProps) => {
    const { isAdmin } = useAuth();
    const {
        previewStream,
        handleUpdate,
        status,
        clearBlobUrl,
        mediaBlobUrl,
        actionButtons,
        startRecording,
        stopRecording,
    } = useVideoRecorder();

    const previewVideoRef = useRef<HTMLVideoElement>();

    const setVideoRef = useCallback(
        (node: HTMLVideoElement | null) => {
            if (node) {
                previewVideoRef.current = node;
                if (previewStream) {
                    node.srcObject = previewStream;
                }
            }
        },
        [previewStream]
    );

    useEffect(() => {
        if (previewVideoRef.current && previewStream) {
            previewVideoRef.current.srcObject = previewStream;
        }

        return () => {
            if (previewVideoRef.current) {
                previewVideoRef.current.srcObject = null;
            }
        };
    }, [previewStream]);

    const { updateVideoRecordsOrder, loading: videoRecordsOrderLoading } =
        useUpdateVideoRecordsOrder();
    const { moveVideoRecords, loading: moveVideoLoading } =
        useMoveVideoRecords();
    const { deleteVideoRecord, loading: deleteLoading } =
        useDeleteVideoRecord();

    const formik = useFormik({
        initialValues: {
            editingRecordId: '',
            name: '',
            comment: '',
            author: '',
            videoFileUrl: '',
        },
        validationSchema: UpdateVideoRecordSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                let updatedData: IUpdateVideoRecord = {
                    name: values.name,
                    comment: values.comment,
                };
                if (mediaBlobUrl) {
                    const result = await handleUpdate(values.videoFileUrl);
                    updatedData.videoFileUrl = result;
                }
                if (values.editingRecordId) {
                    await updateVideoRecord(
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

    const handleDeleteVideoRecord = async (
        videoRecordId: string,
        videoFileUrl: string
    ) => {
        try {
            await deleteVideoRecord(projectId.id, videoRecordId, videoFileUrl);
            fetchData(projectId.id);
        } catch (error) {
            console.error(error);
        }
    };

    const handleMoveVideoRecord = async ({
        oldProjectId,
        newProjectId,
        videoRecordId,
        videoRecordData,
    }: MoveVideoRecordParams) => {
        try {
            await moveVideoRecords(
                oldProjectId,
                newProjectId,
                videoRecordId,
                videoRecordData
            );
            await fetchData(projectId.id);
        } catch (error) {
            console.error(error);
        }
    };

    const { apiRef, startEditing, stopEditing, cancelEditing } =
        useVideoEditingHandlers(formik, clearBlobUrl);

    const columns = createVideoColumns(
        isAdmin,
        startEditing,
        stopEditing,
        cancelEditing,
        handleDeleteVideoRecord,
        handleMoveVideoRecord,
        status,
        mediaBlobUrl,
        actionButtons,
        startRecording,
        stopRecording,
        setVideoRef,
        projects ?? [],
        projectId.id
    );

    const onDragEnd = useDragAndDrop<IVideoRecord>({
        items: videoRecords,
        onReorder,
        updateOrder: updateVideoRecordsOrder,
        fetchData,
        projectId: projectId.id,
    });

    const isLoading =
        loading ||
        formik.isSubmitting ||
        deleteLoading ||
        moveVideoLoading ||
        videoRecordsOrderLoading;

    return (
        <MediaTable
            onDragEnd={onDragEnd}
            apiRef={apiRef}
            mediaRecords={videoRecords}
            columns={columns}
            projectName={projectId.name}
            isLoading={isLoading}
        />
    );
};

export default VideoRecordsTable;
