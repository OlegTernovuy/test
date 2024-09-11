import { IconButton, TextField } from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { AddProjectFormStyled } from '../../../styled/ProjectsPage.styled';

interface IAddProjectProps {
    newProjectName: string;
    setNewProjectName: React.Dispatch<React.SetStateAction<string>>;
    handleAddProject: () => void;
    addLoading: boolean;
    handleCancel: () => void;
}

const AddNewProjectForm = ({
    newProjectName,
    setNewProjectName,
    handleAddProject,
    addLoading,
    handleCancel,
}: IAddProjectProps) => {
    return (
        <AddProjectFormStyled>
            <TextField
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Project name"
                variant="outlined"
                size="small"
                fullWidth
            />
            <IconButton onClick={handleAddProject} disabled={addLoading}>
                <CheckIcon />
            </IconButton>
            <IconButton onClick={handleCancel}>
                <CloseIcon />
            </IconButton>
        </AddProjectFormStyled>
    );
};

export default AddNewProjectForm;
