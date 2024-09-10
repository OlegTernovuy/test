import { IconButton, ListItemText, TextField, Typography } from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

import { EditProjectFormStyled } from '../../../styled/ProjectsPage.styled';

interface ISidebarListItemProps {
    selectedProject: boolean;
    projectName: string;
    editLoading: boolean;
    newProjectName: string;
    error: string | null;
    setNewProjectName: React.Dispatch<React.SetStateAction<string>>;
    handleSaveEdit: () => void;
    handleCancel: () => void;
}

const SidebarListItem = ({
    selectedProject,
    projectName,
    editLoading,
    newProjectName,
    error,
    setNewProjectName,
    handleSaveEdit,
    handleCancel,
}: ISidebarListItemProps) => {
    return (
        <ListItemText
            primary={
                selectedProject ? (
                    <EditProjectFormStyled>
                        <TextField
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            error={Boolean(error)}
                            helperText={error && error}
                            variant="outlined"
                            size="small"
                            fullWidth
                            onClick={(e) => e.stopPropagation()}
                        />
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                handleSaveEdit();
                            }}
                            disabled={editLoading}
                        >
                            <CheckIcon />
                        </IconButton>
                        <IconButton
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCancel();
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                    </EditProjectFormStyled>
                ) : (
                    <Typography>{projectName}</Typography>
                )
            }
        />
    );
};

export default SidebarListItem;
