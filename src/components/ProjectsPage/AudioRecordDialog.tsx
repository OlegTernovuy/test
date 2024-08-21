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

import {
    addAudioRecord,
    updateAudioRecord,
} from '../../services/Media.service';
import { IAudioRecord } from '../../types';
import { UpdateAudioRecordSchema } from '../../utils/valiadtionSchema';

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
    const formik = useFormik({
        initialValues: {
            name: '',
            comment: '',
            author: '',
            project: '',
        },
        validationSchema: UpdateAudioRecordSchema,
        onSubmit: (values, { setSubmitting, resetForm }) => {
            // (actionType === 'add'
            //     ? addAudioRecord({
            //           name: values.AudioName,
            //           author: values.Author,
            //           project: values.Project,
            //           projectId: projectId,
            //       })
            //     : updateAudioRecord(projectId, { // TODO
            //           name: values.AudioName,
            //           author: values.Author,
            //           project: values.Project,
            //       })
            // ).finally(() => {
            //     setSubmitting(false);
            //     fetchData();
            //     resetForm();
            //     onClose();
            // });
        },
    });

    useEffect(() => {
        if (selectedAudioRecord) {
            formik.setValues({
                name: selectedAudioRecord.name,
                author: selectedAudioRecord.author,
                project: selectedAudioRecord.project,
                comment: selectedAudioRecord.comment
            });
        } else {
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
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.name &&
                                    Boolean(formik.errors.name)
                                }
                                helperText={
                                    formik.touched.name &&
                                    formik.errors.name
                                }
                            />
                            <TextField
                                variant="outlined"
                                type="text"
                                label="author"
                                name="author"
                                value={formik.values.author}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.author &&
                                    Boolean(formik.errors.author)
                                }
                                helperText={
                                    formik.touched.author &&
                                    formik.errors.author
                                }
                            />
                            <TextField
                                variant="outlined"
                                type="text"
                                label="project"
                                name="project"
                                value={formik.values.project}
                                onChange={formik.handleChange}
                                error={
                                    formik.touched.project &&
                                    Boolean(formik.errors.project)
                                }
                                helperText={
                                    formik.touched.project &&
                                    formik.errors.project
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
