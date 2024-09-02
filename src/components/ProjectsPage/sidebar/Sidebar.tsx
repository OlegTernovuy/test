import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import {
    AddNewProjectForm,
    SidebarListItem,
    EditButtonsBlock,
} from '../../index';
import {
    SidebarHeaderStyled,
    SliderStyled,
    StyledListItem,
} from '../../../styled/ProjectsPage.styled';
import { Drawer, IconButton, List, Typography } from '@mui/material';
import { AddCircle as AddCircleIcon } from '@mui/icons-material';

import { useAuth } from '../../../Providers/AuthProvider';
import { IProjects } from '../../../types';
import {
    useAddProject,
    useDeleteProject,
    useEditProject,
} from '../../../services/Projects.service';

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
    const navigate = useNavigate();
    const location = useLocation();
    const { isAdmin } = useAuth();

    const searchParams = new URLSearchParams(location.search);
    const projectIdFromUrl = searchParams.get('projectId') || '';

    const [selectProject, setSelectProject] = useState<number>(() => {
        const initialIndex = projects.findIndex(
            (project) => project.id === projectIdFromUrl
        );
        return initialIndex !== -1 ? initialIndex : 0;
    });
    const [newProjectName, setNewProjectName] = useState('');
    const [selectedProjectUpdate, setSelectedProjectUpdate] = useState<
        string | null
    >(null);
    const [isAddingProject, setIsAddingProject] = useState(false);

    const { addProject, loading: addLoading } = useAddProject();
    const { editProject, loading: editLoading } = useEditProject();
    const { deleteProject, loading: deleteLoading } = useDeleteProject();

    const handleSelectProject = useCallback(
        (id: string, name: string) => {
            setSelectProject(
                projects.findIndex((project) => project.id === id)
            );
            setSelectedProjectForCreate({ id, name });
            navigate(`?projectId=${id}`);
        },
        [navigate, projects, setSelectedProjectForCreate]
    );

    const handleEditProject = (id: string, name: string) => {
        setSelectedProjectUpdate(id);
        setNewProjectName(name);
    };

    useEffect(() => {
        if (projectIdFromUrl && projects.length > 0) {
            const projectIndex = projects.findIndex(
                (project) => project.id === projectIdFromUrl
            );
            if (projectIndex !== -1) {
                setSelectProject(projectIndex);
                setSelectedProjectForCreate({
                    id: projects[projectIndex].id,
                    name: projects[projectIndex].name,
                });
            }
        } else if (projects.length > 0) {
            handleSelectProject(projects[0].id, projects[0].name);
        }
    }, [
        projectIdFromUrl,
        projects,
        setSelectedProjectForCreate,
        handleSelectProject,
    ]);

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
                            <AddCircleIcon color="primary" />
                        </IconButton>
                    )}
                </SidebarHeaderStyled>
                {isAddingProject && (
                    <AddNewProjectForm
                        newProjectName={newProjectName}
                        setNewProjectName={setNewProjectName}
                        handleAddProject={handleAddProject}
                        addLoading={addLoading}
                        handleCancel={handleCancel}
                    />
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
                            <SidebarListItem
                                selectedProject={
                                    selectedProjectUpdate === project.id
                                }
                                projectName={project.name}
                                editLoading={editLoading}
                                newProjectName={newProjectName}
                                setNewProjectName={setNewProjectName}
                                handleSaveEdit={() =>
                                    handleSaveEdit(project.id)
                                }
                                handleCancel={handleCancel}
                            />
                            {isAdmin &&
                                selectedProjectUpdate !== project.id && (
                                    <EditButtonsBlock
                                        handleEditProject={() =>
                                            handleEditProject(
                                                project.id,
                                                project.name
                                            )
                                        }
                                        handleDeleteProject={() =>
                                            handleDeleteProject(project.id)
                                        }
                                        deleteLoading={deleteLoading}
                                    />
                                )}
                        </StyledListItem>
                    ))}
                </List>
            </SliderStyled>
        </Drawer>
    );
};

export default Sidebar;
