import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
} from '@mui/material';

interface ProjectDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (projectName: string) => void;
    actionType: 'add' | 'edit' | 'delete';
    projectName?: string;
}

const ProjectDialog: React.FC<ProjectDialogProps> = ({
    open,
    onClose,
    onConfirm,
    actionType,
    projectName = '',
}) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (open) {
            setName(projectName);
        }
    }, [open, projectName]);

    const handleConfirm = () => {
        onConfirm(name);
        setName('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                {actionType === 'add' && 'Add New Project'}
                {actionType === 'edit' && 'Edit Project'}
                {actionType === 'delete' && 'Delete Project'}
            </DialogTitle>
            <DialogContent>
                {actionType === 'delete' ? (
                    <p>Are you sure you want to delete this project?</p>
                ) : (
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Project Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleConfirm}
                    color={actionType === 'delete' ? 'secondary' : 'primary'}
                >
                    {actionType === 'delete' ? 'Delete' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProjectDialog;
