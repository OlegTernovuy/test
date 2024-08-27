import { useEffect } from 'react';
import { useFormik } from 'formik';

import { CustomMediaRecorder, CustomSelect } from '../index';
import {
    CircularProgressStyled,
    InputsSelectStyled,
    MediaStyled,
} from '../../styled/CustomMediaRecorder.styled';
import {
    AudioRecordFormStyled,
    AudioRecordWrapper,
} from '../../styled/AddAudioRecordForm.styled';
import { CircularProgress, TextField } from '@mui/material';

import useWaveSurfer from '../../hook/useWaveSurfer';
import { AddAudioRecordSchema } from '../../utils/valiadtionSchema';
import { addAudioRecord } from '../../services/Media.service';

interface IAudioDataProps {
    author: string;
    project: string;
    projectId: string;
    fetchData: (projectId: string) => void;
}

const AddAudioRecordForm = ({
    author,
    project,
    projectId,
    fetchData,
}: IAudioDataProps) => {
    const {
        handleDone,
        status,
        mediaBlobUrl,
        actionButtons,
        selectors,
        startRecording,
        stopRecording,
    } = useWaveSurfer();

    const formik = useFormik({
        initialValues: {
            name: '',
            comment: '',
            author: author || '',
            project: project || '',
            projectId: projectId || '',
            audioFileUrl: '',
        },
        validationSchema: AddAudioRecordSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const result = await handleDone();

                if (!result) {
                    throw new Error('Audio file URL is required.');
                }

                await addAudioRecord({
                    name: values.name,
                    comment: values.comment,
                    author: values.author,
                    project: values.project,
                    projectId: values.projectId,
                    audioFileUrl: result,
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
                project: project || prevValues.project,
                projectId: projectId || prevValues.projectId,
            }));
        }
    }, [author, project, projectId]);

    if (!selectors[0].selected) {
        return (
            <CircularProgressStyled>
                <CircularProgress />
            </CircularProgressStyled>
        );
    }

    return (
        <AudioRecordWrapper>
            <AudioRecordFormStyled onSubmit={formik.handleSubmit}>
                <MediaStyled>
                    <InputsSelectStyled>
                        {selectors.map((selector, index) => (
                            <CustomSelect key={index} {...selector} />
                        ))}
                    </InputsSelectStyled>
                    <TextField
                        variant="outlined"
                        label="Audio name"
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
                    <TextField
                        type="text"
                        label="Comment"
                        multiline
                        rows={4}
                        name="comment"
                        value={formik.values.comment}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.comment &&
                            Boolean(formik.errors.comment)
                        }
                        helperText={
                            formik.touched.comment && formik.errors.comment
                        }
                    />
                </MediaStyled>
                <CustomMediaRecorder
                    status={status}
                    mediaBlobUrl={mediaBlobUrl}
                    actionButtons={actionButtons}
                    startRecording={startRecording}
                    stopRecording={stopRecording}
                    disabled={formik.isSubmitting}
                    isAddingFroms
                />
            </AudioRecordFormStyled>
        </AudioRecordWrapper>
    );
};

export default AddAudioRecordForm;
