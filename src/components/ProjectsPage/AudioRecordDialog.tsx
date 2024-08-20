import { useEffect } from 'react';
import { useFormik } from 'formik';

import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
} from '@mui/material';
import { AudioRecordForm } from '../../styled/AudioRecordDialog.styled';

import { AddAudioRecordSchema } from '../../utils/valiadtionSchema';
import { addAudioRecord } from '../../services/Media.service';
import { IAudioRecord } from '../../types';

interface AudioRecordsDialogProps {
    open: boolean;
    onClose: () => void;
    projectId: string;
    fetchData: () => void;
    actionType: 'add' | 'edit' | 'delete';
    selectedAudioRecord: IAudioRecord | null;
}

const AudioRecordDialog = ({
    open,
    onClose,
    projectId,
    fetchData,
    actionType,
    selectedAudioRecord,
}: AudioRecordsDialogProps) => {
    console.log('selectedAudioRecord', selectedAudioRecord);

    const formik = useFormik({
        initialValues: {
            AudioName: '',
            Author: '',
            Project: '',
        },
        validationSchema: AddAudioRecordSchema,
        onSubmit: (values, { setSubmitting, resetForm }) => {
            actionType === 'add'
                ? addAudioRecord({
                      name: values.AudioName,
                      author: values.Author,
                      project: values.Project,
                      projectId: projectId,
                  })
                : addAudioRecord({
                      name: values.AudioName,
                      author: values.Author,
                      project: values.Project,
                      projectId: projectId,
                  }).finally(() => {
                      setSubmitting(false);
                      fetchData();
                      resetForm();
                      onClose();
                  });
        },
    });

    useEffect(() => {
        if (selectedAudioRecord) {
            formik.setValues({
                AudioName: selectedAudioRecord.name,
                Author: selectedAudioRecord.author,
                Project: selectedAudioRecord.project,
            });
        } else {
            // Очищуємо форму, якщо selectedAudioRecord пустий
            formik.resetForm();
        }
    }, [selectedAudioRecord]);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                {actionType === 'add' && 'Add New Audio Record'}
                {actionType === 'edit' && 'Edit Audio Record'}
                {actionType === 'delete' && 'Delete Audio Record'}
            </DialogTitle>
            <DialogContent>
                <AudioRecordForm onSubmit={formik.handleSubmit}>
                    {actionType === 'delete' ? (
                        <p>Are you sure you want to delete this project?</p>
                    ) : (
                        <>
                            <TextField
                                variant="outlined"
                                type="text"
                                label="Audio name"
                                name="AudioName"
                                value={formik.values.AudioName}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.AudioName &&
                                    Boolean(formik.errors.AudioName)
                                }
                                helperText={
                                    formik.touched.AudioName &&
                                    formik.errors.AudioName
                                }
                            />
                            <TextField
                                variant="outlined"
                                type="text"
                                label="Author"
                                name="Author"
                                value={formik.values.Author}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.Author &&
                                    Boolean(formik.errors.Author)
                                }
                                helperText={
                                    formik.touched.Author &&
                                    formik.errors.Author
                                }
                            />
                            <TextField
                                variant="outlined"
                                type="text"
                                label="Project"
                                name="Project"
                                value={formik.values.Project}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.Project &&
                                    Boolean(formik.errors.Project)
                                }
                                helperText={
                                    formik.touched.Project &&
                                    formik.errors.Project
                                }
                            />
                        </>
                    )}
                    <Button
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={formik.isSubmitting}
                    >
                        {actionType === 'delete' ? 'Delete' : 'Save'}
                    </Button>
                </AudioRecordForm>
            </DialogContent>
        </Dialog>
    );
};

export default AudioRecordDialog;
