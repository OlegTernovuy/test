import React, { useEffect, useState } from 'react';

import {
    IconContainer,
    SidebarHeaderStyled,
    SliderStyled,
    StyledListItem,
} from '../../styled/ProjectsPage.styled';
import {
    Box,
    Button,
    Drawer,
    IconButton,
    List,
    ListItemText,
    TextField,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

import { useAuth } from '../../Providers/AuthProvider';
import { IProjects } from '../../types';
import useFetchData from '../../hook/useFetch';

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
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
        null
    );
    const [isAddingProject, setIsAddingProject] = useState(false);
    const { isAdmin } = useAuth();

    const handleSelectProject = (id: string, name: string) => {
        setSelectProject(projects.findIndex((project) => project.id === id));
        setSelectedProjectForCreate({ id, name });
    };

    const handleEditProject = (id: string, name: string) => {
        setSelectedProjectUpdate(id);
        setNewProjectName(name);
    };

    const { loading: LoadingAddProject, fetchData: addProject } = useFetchData(
        '/projects',
        {
            method: 'POST',
        }
    );

    const { loading: LoadingEditProject, fetchData: editProject } =
        useFetchData(`/projects/${selectedProjectId}`, {
            method: 'PATCH',
        });

    const { loading: LoadingDeleteProject, fetchData: deleteProject } =
        useFetchData(`/projects/${selectedProjectId}`, {
            method: 'DELETE',
        });

    useEffect(() => {
        if (projects && projects[selectProject]?.id) {
            setSelectedProjectForCreate({
                id: projects[selectProject].id,
                name: projects[selectProject].name,
            });
        }
    }, [projects, selectProject, setSelectedProjectForCreate]);

    const handleSaveEdit = async () => {
        if (newProjectName.trim() && selectedProjectUpdate !== null) {
            await editProject({ name: newProjectName });
            await fetchProjects();
            setNewProjectName('');
            setSelectedProjectUpdate(null);
        }
    };

    const handleDeleteProject = async () => {
        await deleteProject();
        await fetchProjects();
    };

    const handleAddProject = async () => {
        if (newProjectName.trim()) {
            await addProject({ name: newProjectName });
            await fetchProjects();
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
                        <Button onClick={() => setIsAddingProject(true)}>
                            <AddIcon />
                        </Button>
                    )}
                </SidebarHeaderStyled>
                {isAddingProject && (
                    <Box display="flex" alignItems="center" marginBottom={2}>
                        <TextField
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="Project name"
                            variant="outlined"
                            size="small"
                            fullWidth
                        />
                        <IconButton onClick={handleAddProject}>
                            <CheckIcon />
                        </IconButton>
                        <IconButton onClick={handleCancel}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
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
                                        <Box display="flex" alignItems="center">
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
                                                    handleSaveEdit();
                                                }}
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
                                        </Box>
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
                                                setSelectedProjectId(
                                                    project.id
                                                );
                                                handleEditProject(
                                                    project.id,
                                                    project.name
                                                );
                                            }}
                                        >
                                            <EditIcon
                                                fontSize="small"
                                                color="primary"
                                            />
                                        </IconButton>
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const projectId = project.id;
                                                setSelectedProjectId(projectId);
                                                handleDeleteProject();
                                            }}
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
