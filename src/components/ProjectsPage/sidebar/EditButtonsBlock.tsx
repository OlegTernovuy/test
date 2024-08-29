import { IconButton } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { IconContainer } from '../../../styled/ProjectsPage.styled';

interface IEditButtonsProps {
    handleEditProject: () => void;
    handleDeleteProject: () => void;
    deleteLoading: boolean;
}

const EditButtonsBlock = ({
    handleEditProject,
    handleDeleteProject,
    deleteLoading,
}: IEditButtonsProps) => {
    return (
        <IconContainer>
            <IconButton
                onClick={(e) => {
                    e.stopPropagation();
                    handleEditProject();
                }}
            >
                <EditIcon fontSize="small" color="primary" />
            </IconButton>
            <IconButton
                onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject();
                }}
                disabled={deleteLoading}
            >
                <DeleteIcon fontSize="small" color="primary" />
            </IconButton>
        </IconContainer>
    );
};

export default EditButtonsBlock;
