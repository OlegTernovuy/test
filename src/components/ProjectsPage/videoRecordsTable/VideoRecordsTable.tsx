import { useCallback, useEffect, useRef, useState } from 'react';
import { DataGrid, GridPaginationModel } from '@mui/x-data-grid';
import { useFormik } from 'formik';

import { VideoRecordsTableWrapper } from '../../../styled/VideoRecordsTable.styled';
import { IVideoRecord } from '../../../types';
import { useAuth } from '../../../Providers/AuthProvider';
import {
    IUpdateVideoRecord,
    updateVideoRecord,
    useDeleteVideoRecord,
} from '../../../services/Video.service';
import { UpdateVideoRecordSchema } from '../../../utils/validationSchema';
import useVideoRecorder from '../../../hook/useVideoRecorder';
import useVideoEditingHandlers from '../../../hook/useVideoEditingHandlers';
import { createVideoColumns } from '../../';
import ProjectTitleSearchComponent from '../ProjectTitleSearchComponent';

interface IVideoRecordProps {
    videoRecords: IVideoRecord[];
    loading: boolean;
    fetchData: (projectId: string) => void;
    projectId: { id: string; name: string };
}

const VideoRecordsTable = ({
    videoRecords,
    loading,
    fetchData,
    projectId,
}: IVideoRecordProps) => {
    const { isAdmin } = useAuth();
    const {
        previewInputStream,
        handleUpdate,
        status,
        clearBlobUrl,
        mediaBlobUrl,
        actionButtons,
        startRecording,
        stopRecording,
    } = useVideoRecorder();

    const previewVideoRef = useRef<HTMLVideoElement>(null!);

    const setVideoRef = useCallback(
        (node: HTMLVideoElement | null) => {
            if (node) {
                previewVideoRef.current = node;
                if (previewInputStream) {
                    node.srcObject = previewInputStream;
                }
            }
        },
        [previewInputStream]
    );

    useEffect(() => {
        if (previewVideoRef.current && previewInputStream) {
            previewVideoRef.current.srcObject = previewInputStream;
        }

        return () => {
            if (previewVideoRef.current) {
                previewVideoRef.current.srcObject = null;
            }
        };
    }, [previewInputStream]);

    const { deleteVideoRecord, loading: deleteLoading } =
        useDeleteVideoRecord();
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

    const { apiRef, startEditing, stopEditing, cancelEditing } =
        useVideoEditingHandlers(formik, clearBlobUrl);

    const columns = createVideoColumns(
        isAdmin,
        projectId.id,
        startEditing,
        stopEditing,
        cancelEditing,
        handleDeleteVideoRecord,
        status,
        mediaBlobUrl,
        actionButtons,
        startRecording,
        stopRecording,
        setVideoRef,
        fetchData
    );

    return (
        <VideoRecordsTableWrapper>
            <DataGrid
                apiRef={apiRef}
                rows={videoRecords}
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
                }}
            />
        </VideoRecordsTableWrapper>
    );
};

export default VideoRecordsTable;
