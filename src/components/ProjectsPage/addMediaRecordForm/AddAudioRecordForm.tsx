import { useEffect } from 'react';
import { useFormik } from 'formik';
import { CircularProgress, TextField } from '@mui/material';

import { CustomMediaRecorder, CustomSelect } from '../../';
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

import { useWaveSurfer } from '../../../hook';
import { AddAudioRecordSchema } from '../../../utils/validationSchema';
import { addAudioRecord } from '../../../services/Audio.service';

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
    } = useWaveSurfer('#wavesurfer-add');

    const formik = useFormik({
        initialValues: {
            name: '',
            comment: '',
            author: author || '',
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

                await addAudioRecord(projectId, {
                    name: values.name,
                    comment: values.comment,
                    author: values.author,
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
                    <StyledTextarea
                        name="comment"
                        placeholder="Comment"
                        rows={4}
                        value={formik.values.comment}
                        onChange={formik.handleChange}
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
                    wavesurferId="wavesurfer-add"
                />
            </MediaRecordWrapper>
        </MediaRecordFormStyled>
    );
};

export default AddAudioRecordForm;
