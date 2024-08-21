import React, { useEffect } from 'react';

import { Mic } from '@mui/icons-material';
import { CircularProgress, TextField, Button, IconButton } from '@mui/material';

import {
    AvesurferStyled,
    ActionsStyled,
    ActionsContentStyled,
    CircularProgressStyled,
    MediaStyled,
    TitleSelectStyled,
} from '../../styled/CustomMediaRecorder.styled';
import CustomSelect from './CustomSelect';
import HeaderMedia from './HeaderMedia';
import CustomIconButton from './CustomIconButton';
import useWaveSurfer from '../../hook/useWaveSurfer';
import { useFormik } from 'formik';
import { addAudioRecord } from '../../services/Media.service';
import { AddAudioRecordSchema } from '../../utils/valiadtionSchema';
import {
    AudioRecordFormStyled,
    SaveButtonStyled,
} from '../../styled/AddAudioRecordForm.styled';

interface IAudioDataProps {
    author: string;
    project: string;
    projectId: string;
    fetchData: () => void;
}

const CustomMediaRecorder: React.FC<IAudioDataProps> = ({
    author,
    project,
    projectId,
    fetchData,
}) => {
    const {
        status,
        mediaBlobUrl,
        actionButtons,
        selectors,
        startRecording,
        handleDone,
    } = useWaveSurfer();

    const formik = useFormik({
        initialValues: {
            name: '',
            comment: '',
            author: author,
            project: project,
            projectId: projectId,
            audioFileUrl: '',
        },
        validationSchema: AddAudioRecordSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const result = await handleDone();
                await addAudioRecord({
                    name: values.name,
                    comment: values.comment,
                    author: values.author,
                    project: values.project,
                    projectId: values.projectId,
                    audioFileUrl: result.data.audioUrl,
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
        if (project) {
            formik.setFieldValue('project', project);
        }
        if (projectId) {
            formik.setFieldValue('projectId', projectId);
        }
    }, [project, projectId]);

    if (!selectors[0].selected) {
        return (
            <CircularProgressStyled>
                <CircularProgress />
            </CircularProgressStyled>
        );
    }
    return (
        <MediaStyled>
            {selectors.map((selector, index) => (
                <CustomSelect key={index} {...selector} />
            ))}
            <ActionsStyled>
                <HeaderMedia status={status} mediaBlobUrl={mediaBlobUrl} />
                {status !== 'recording' && !mediaBlobUrl && (
                    <IconButton onClick={startRecording} size="small">
                        <Mic color={'secondary'} />
                    </IconButton>
                )}
                <ActionsContentStyled>
                    {actionButtons.map((buttonInfo, index) => (
                        <CustomIconButton key={index} {...buttonInfo} />
                    ))}
                </ActionsContentStyled>
            </ActionsStyled>
            {mediaBlobUrl && <AvesurferStyled id="wavesurfer-id" />}
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
        </MediaStyled>
    );
};

export default CustomMediaRecorder;
