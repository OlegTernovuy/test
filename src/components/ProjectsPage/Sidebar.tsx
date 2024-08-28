import React, { useEffect, useState } from 'react';

import {
    AddProjectFormStyled,
    EditProjectFormStyled,
    IconContainer,
    SidebarHeaderStyled,
    SliderStyled,
    StyledListItem,
} from '../../styled/ProjectsPage.styled';
import {
    Drawer,
    IconButton,
    List,
    ListItemText,
    TextField,
    Typography,
} from '@mui/material';
import {
    AddCircle as AddCircleIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Check as CheckIcon,
    Close as CloseIcon,
} from '@mui/icons-material';

import { useAuth } from '../../Providers/AuthProvider';
import { IProjects } from '../../types';
import {
    useAddProject,
    useDeleteProject,
    useEditProject,
} from '../../services/Projects.service';

interface ISidebarProps {
    projects: IProjects[];
    setSelectedProjectForCreate: React.Dispatch<
        React.SetStateAction<IProjects>
    >;
    open: boolean;
    toggleDrawer: () => void;
    fetchProjects: () => void;
}

const Sidebar: React.FC<ISidebarProps> = ({
    projects,
    setSelectedProjectForCreate,
    open,
    toggleDrawer,
    fetchProjects,
}) => {
    const [selectProject, setSelectProject] = useState(0);
    const [newProjectName, setNewProjectName] = useState('');
    const [selectedProjectUpdate, setSelectedProjectUpdate] = useState<
        string | null
    >(null);
    const [isAddingProject, setIsAddingProject] = useState(false);
    const { isAdmin } = useAuth();

    const { addProject, loading: addLoading } = useAddProject();
    const { editProject, loading: editLoading } = useEditProject();
    const { deleteProject, loading: deleteLoading } = useDeleteProject();

    const handleSelectProject = (id: string, name: string) => {
        setSelectProject(projects.findIndex((project) => project.id === id));
        setSelectedProjectForCreate({ id, name });
    };

    const handleEditProject = (id: string, name: string) => {
        setSelectedProjectUpdate(id);
        setNewProjectName(name);
    };

    useEffect(() => {
        if (projects && projects[selectProject]?.id) {
            setSelectedProjectForCreate({
                id: projects[selectProject].id,
                name: projects[selectProject].name,
            });
        }
    }, [projects, selectProject, setSelectedProjectForCreate]);

    const handleSaveEdit = async (id: string) => {
        if (newProjectName.trim() && selectedProjectUpdate !== null) {
            await editProject(id, newProjectName, fetchProjects);
            setNewProjectName('');
            setSelectedProjectUpdate(null);
        }
    };

    const handleDeleteProject = async (id: string) => {
        await deleteProject(id, fetchProjects);
    };

    const handleAddProject = async () => {
        if (newProjectName.trim()) {
            await addProject(newProjectName, fetchProjects);
            setNewProjectName('');
            setIsAddingProject(false);
        }
    };

    const handleCancel = () => {
        setNewProjectName('');
        setSelectedProjectUpdate(null);
        setIsAddingProject(false);
    };

    return (
        <Drawer open={open} onClose={toggleDrawer}>
            <SliderStyled>
                <SidebarHeaderStyled>
                    <Typography variant="h6">Projects</Typography>
                    {isAdmin && (
                        <IconButton onClick={() => setIsAddingProject(true)}>
                            <AddCircleIcon color='primary'/>
                        </IconButton>
                    )}
                </SidebarHeaderStyled>
                {isAddingProject && (
                    <AddProjectFormStyled>
                        <TextField
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="Project name"
                            variant="outlined"
                            size="small"
                            fullWidth
                        />
                        <IconButton
                            onClick={handleAddProject}
                            disabled={addLoading}
                        >
                            <CheckIcon />
                        </IconButton>
                        <IconButton onClick={handleCancel}>
                            <CloseIcon />
                        </IconButton>
                    </AddProjectFormStyled>
                )}
                <List>
                    {projects.map((project, index) => (
                        <StyledListItem
                            key={project.id}
                            onClick={() => {
                                handleSelectProject(project.id, project.name);
                                toggleDrawer();
                            }}
                            isSelected={selectProject === index}
                        >
                            <ListItemText
                                primary={
                                    selectedProjectUpdate === project.id ? (
                                        <EditProjectFormStyled>
                                            <TextField
                                                value={newProjectName}
                                                onChange={(e) =>
                                                    setNewProjectName(
                                                        e.target.value
                                                    )
                                                }
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            />
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSaveEdit(project.id);
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
                                        <Typography>{project.name}</Typography>
                                    )
                                }
                            />
                            {isAdmin &&
                                selectedProjectUpdate !== project.id && (
                                    <IconContainer>
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditProject(
                                                    project.id,
                                                    project.name
                                                );
                                            }}
                                            disabled={editLoading}
                                        >
                                            <EditIcon
                                                fontSize="small"
                                                color="primary"
                                            />
                                        </IconButton>
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteProject(project.id);
                                            }}
                                            disabled={deleteLoading}
                                        >
                                            <DeleteIcon
                                                fontSize="small"
                                                color="primary"
                                            />
                                        </IconButton>
                                    </IconContainer>
                                )}
                        </StyledListItem>
                    ))}
                </List>
            </SliderStyled>
        </Drawer>
    );
};

export default Sidebar;
