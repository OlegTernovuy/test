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
import { addVideoRecord } from '../../../services/Video.service';

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
        previewInputStream,
        previewOutputStream,
        inputSelectors,
        outputSelectors,
        actionButtons,
        startRecording,
        stopRecording,
        setShouldPreviewStream,
    } = useVideoRecorder();

    const previewVideoInputRef = useRef<HTMLVideoElement>(null);
    const previewVideoOutputRef = useRef<HTMLVideoElement>(null);

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
                const result = await handleDone();

                if (!result) {
                    throw new Error('Audio file URL is required.');
                }

                await addVideoRecord(projectId, {
                    name: values.name,
                    comment: values.comment,
                    author: values.author,
                    videoFileUrl: result,
                });
                fetchData(projectId);

                resetForm();
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
        if (previewVideoInputRef.current && previewInputStream) {
            previewVideoInputRef.current.srcObject = previewInputStream;
        }
    }, [previewInputStream]);

    useEffect(() => {
        if (previewVideoOutputRef.current && previewOutputStream) {
            previewVideoOutputRef.current.srcObject = previewOutputStream;
        }
    }, [previewOutputStream]);

    useEffect(() => {
        if (currentTab?.value === 'video') setShouldPreviewStream(true);
    }, [currentTab]);

    const noSelectorsSelected =
        inputSelectors.length > 0 &&
        outputSelectors.length > 0 &&
        !inputSelectors[0].selected &&
        !outputSelectors[0].selected;

    if (noSelectorsSelected) {
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
                        {inputSelectors.map((selector, index) => (
                            <CustomSelect key={index} {...selector} />
                        ))}
                        {outputSelectors.map((selector, index) => (
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
                        actionButtons={actionButtons}
                        disabled={formik.isSubmitting}
                        isAddingFroms
                    >
                        {
                            <>
                                <Stack direction="row">
                                    <video
                                        ref={previewVideoInputRef}
                                        width={300}
                                        height={150}
                                        autoPlay
                                    />
                                    {previewOutputStream && (
                                        <video
                                            ref={previewVideoOutputRef}
                                            width={300}
                                            height={150}
                                            autoPlay
                                        />
                                    )}

                                    {mediaBlobUrl && (
                                        <video
                                            src={mediaBlobUrl}
                                            width={300}
                                            height={150}
                                            controls
                                        />
                                    )}
                                </Stack>
                            </>
                        }
                    </CustomVideoRecorder>
                </Stack>
            </MediaRecordWrapper>
        </MediaRecordFormStyled>
    );
};

export default AddVideoRecordForm;
