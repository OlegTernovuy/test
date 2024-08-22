import { useEffect } from 'react';
import { useFormik } from 'formik';

import { CustomRecordAudioForm } from '../index';
import { TitleSelectStyled } from '../../styled/CustomMediaRecorder.styled';
import {
    AudioRecordFormStyled,
    AudioRecordWrapper,
    SaveButtonStyled,
} from '../../styled/AddAudioRecordForm.styled';
import { Button, TextField } from '@mui/material';

import useWaveSurfer from '../../hook/useWaveSurfer';
import { AddAudioRecordSchema } from '../../utils/valiadtionSchema';
import { addAudioRecord } from '../../services/Media.service';

interface IAudioDataProps {
    author: string;
    project: string;
    projectId: string;
    fetchData: () => void;
}

const AddAudioRecordForm = ({
    author,
    project,
    projectId,
    fetchData,
}: IAudioDataProps) => {
    const waveSurferData = useWaveSurfer();
    const { handleDone } = waveSurferData;

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

                await addAudioRecord({
                    name: values.name,
                    comment: values.comment,
                    author: values.author,
                    project: values.project,
                    projectId: values.projectId,
                    audioFileUrl: result,
                });
                fetchData();
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

    return (
        <AudioRecordWrapper>
            <CustomRecordAudioForm {...waveSurferData} />
            <AudioRecordFormStyled onSubmit={formik.handleSubmit}>
                <div>
                    <TitleSelectStyled>Audio name</TitleSelectStyled>
                    <TextField
                        variant="outlined"
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
                </div>
                <div>
                    <TitleSelectStyled>Comment</TitleSelectStyled>
                    <TextField
                        variant="outlined"
                        type="text"
                        size="small"
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
                </div>
                <SaveButtonStyled>
                    <Button variant="contained" type="submit">
                        Save
                    </Button>
                </SaveButtonStyled>
            </AudioRecordFormStyled>
        </AudioRecordWrapper>
    );
};

export default AddAudioRecordForm;
