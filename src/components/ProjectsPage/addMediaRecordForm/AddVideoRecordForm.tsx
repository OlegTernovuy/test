import { useEffect, useRef } from 'react';
import { useFormik } from 'formik';
import { CircularProgress, Stack, TextField } from '@mui/material';
import { useTabContext } from '@mui/lab';

import { CustomSelect } from '../../';
import {
    CircularProgressStyled,
    InputsSelectStyled,
    MediaStyled,
} from '../../../styled/CustomMediaRecorder.styled';
import {
    MediaRecordFormStyled,
    MediaRecordWrapper,
    StyledTextarea,
} from '../../../styled/AddMediaRecordForm.styled';
import { AddVideoRecordSchema } from '../../../utils/validationSchema';
import useVideoRecorder from '../../../hook/useVideoRecorder';
import { CustomVideoRecorder } from '../../';

interface IVideoDataProps {
    author: string;
    project: string;
    projectId: string;
    fetchData: (projectId: string) => void;
}

const AddVideoRecordForm = ({
    author,
    project,
    projectId,
    fetchData,
}: IVideoDataProps) => {
    const currentTab = useTabContext();
    const {
        handleDone,
        status,
        mediaBlobUrl,
        previewStream,
        selectors,
        startRecording,
        stopRecording,
        setShouldPreview,
    } = useVideoRecorder();

    const previewVideoRef = useRef<HTMLVideoElement>(null);

    const formik = useFormik({
        initialValues: {
            name: '',
            comment: '',
            author: author || '',
            audioFileUrl: '',
        },
        validationSchema: AddVideoRecordSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                // save video file
            } catch (error) {
                console.error('Error submitting the form: ', error);
            } finally {
                setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        if (author || project || projectId) {
            formik.setValues((prevValues) => ({
                ...prevValues,
                author: author || prevValues.author,
            }));
        }
    }, [author, project, projectId]);

    useEffect(() => {
        if (previewVideoRef.current && previewStream) {
            previewVideoRef.current.srcObject = previewStream;
        }
    }, [previewStream]);

    useEffect(() => {
        if (currentTab?.value === 'video') setShouldPreview(true);
    }, [currentTab]);

    if (!selectors[0].selected) {
        return (
            <CircularProgressStyled>
                <CircularProgress />
            </CircularProgressStyled>
        );
    }

    return (
        <MediaRecordFormStyled onSubmit={formik.handleSubmit}>
            <MediaRecordWrapper>
                <MediaStyled>
                    <InputsSelectStyled>
                        {selectors.map((selector, index) => (
                            <CustomSelect key={index} {...selector} />
                        ))}
                    </InputsSelectStyled>
                    <TextField
                        variant="outlined"
                        label="Video name"
                        type="text"
                        size="small"
                        name="name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.name && Boolean(formik.errors.name)
                        }
                        helperText={formik.touched.name && formik.errors.name}
                    />
                    <StyledTextarea
                        name="comment"
                        placeholder="Comment"
                        rows={4}
                        value={formik.values.comment}
                        onChange={formik.handleChange}
                    />
                </MediaStyled>
                <Stack spacing={2}>
                    <CustomVideoRecorder
                        status={status}
                        mediaBlobUrl={mediaBlobUrl}
                        startRecording={startRecording}
                        stopRecording={stopRecording}
                        disabled={formik.isSubmitting}
                        isAddingFroms
                    >
                        <Stack direction="row">
                            <video
                                ref={previewVideoRef}
                                width={320}
                                height={160}
                                autoPlay
                            />
                            {mediaBlobUrl && (
                                <video
                                    src={mediaBlobUrl}
                                    width={320}
                                    height={160}
                                    controls
                                />
                            )}
                        </Stack>
                    </CustomVideoRecorder>
                </Stack>
            </MediaRecordWrapper>
        </MediaRecordFormStyled>
    );
};

export default AddVideoRecordForm;
