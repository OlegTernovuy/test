import React, { useState } from 'react';

import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import { Alert } from '@mui/material';

interface SimpleSnackbarProps {
    message: string;
}

const SnackbarNotification: React.FC<SimpleSnackbarProps> = ({ message }) => {
    const [open, setOpen] = useState(true);

    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason
    ) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <Snackbar open={open} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" variant="filled">
                {message}
            </Alert>
        </Snackbar>
    );
};

export default SnackbarNotification;
