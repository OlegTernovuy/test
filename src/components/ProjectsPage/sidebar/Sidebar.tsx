import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import { AddNewProjectForm, SidebarList } from '../../index';
import {
    CircularProgressWrapper,
    SidebarHeaderStyled,
    SliderStyled,
} from '../../../styled/ProjectsPage.styled';
import {
    CircularProgress,
    Drawer,
    IconButton,
    Typography,
} from '@mui/material';
import { AddCircle as AddCircleIcon } from '@mui/icons-material';

import {
    useAddProject,
    useUpdateProjectsOrder,
} from '../../../services/Projects.service';
import { useAuth } from '../../../Providers/AuthProvider';
import { IProjects } from '../../../types';

interface ISidebarProps {
    projects: IProjects[];
    onReorder: (reorderedProjects: IProjects[]) => void;
    setSelectedProjectForCreate: React.Dispatch<
        React.SetStateAction<{id: string, name: string}>
    >;
    open: boolean;
    toggleDrawer: () => void;
    fetchProjects: () => void;
}

const Sidebar: React.FC<ISidebarProps> = React.memo(
    ({
        projects,
        onReorder,
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

        const [selectProject, setSelectProject] = useState<string | null>(
            () => {
                if (projects.length > 0) {
                    const initialProject = projects.find(
                        (project) => project.id === projectIdFromUrl
                    );
                    return initialProject !== undefined
                        ? initialProject.id
                        : projects[0].id;
                }
                return null;
            }
        );

        const [newProjectName, setNewProjectName] = useState('');
        const [selectedProjectUpdate, setSelectedProjectUpdate] = useState<
            string | null
        >(null);
        const [isAddingProject, setIsAddingProject] = useState(false);

        const {
            addProject,
            loading: addLoading,
            error: addProjectError,
            clearError: clearAddProjectError,
        } = useAddProject();

        const handleSelectProject = useCallback(
            (id: string, name: string) => {
                setSelectProject(id);
                setSelectedProjectForCreate({ id, name });
                navigate(`?projectId=${id}`);
            },
            [navigate, setSelectedProjectForCreate]
        );

        useEffect(() => {
            if (projectIdFromUrl && projects.length > 0) {
                const selectedProject = projects.find(
                    (project) => project.id === projectIdFromUrl
                );
                if (selectedProject) {
                    setSelectProject(selectedProject.id);
                    setSelectedProjectForCreate({
                        id: selectedProject.id,
                        name: selectedProject.name,
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

        const handleAddProject = async () => {
            if (newProjectName.trim()) {
                try {
                    await addProject(newProjectName, fetchProjects);
                    setNewProjectName('');
                    setIsAddingProject(false);
                } catch (error) {
                    console.log(error);
                }
            }
        };

        const handleCancel = () => {
            setNewProjectName('');
            setSelectedProjectUpdate(null);
            setIsAddingProject(false);
            clearAddProjectError();
        };

        const { updateProjectsOrder, loading: projectsOrderLoading } =
            useUpdateProjectsOrder();

        return (
            <Drawer open={open} onClose={toggleDrawer}>
                <SliderStyled>
                    <SidebarHeaderStyled>
                        <Typography variant="h6">Projects</Typography>
                        {isAdmin && (
                            <IconButton
                                onClick={() => setIsAddingProject(true)}
                            >
                                <AddCircleIcon color="primary" />
                            </IconButton>
                        )}
                    </SidebarHeaderStyled>
                    {isAddingProject && (
                        <AddNewProjectForm
                            newProjectName={newProjectName}
                            setNewProjectName={setNewProjectName}
                            handleAddProject={handleAddProject}
                            error={addProjectError}
                            addLoading={addLoading}
                            handleCancel={handleCancel}
                        />
                    )}
                    <SidebarList
                        projects={projects}
                        onReorder={onReorder}
                        updateProjectsOrder={updateProjectsOrder}
                        setSelectedProjectUpdate={setSelectedProjectUpdate}
                        setNewProjectName={setNewProjectName}
                        newProjectName={newProjectName}
                        selectedProjectUpdate={selectedProjectUpdate}
                        fetchProjects={fetchProjects}
                        selectProject={selectProject}
                        toggleDrawer={toggleDrawer}
                        handleSelectProject={handleSelectProject}
                        handleCancel={handleCancel}
                    />
                    {projectsOrderLoading && (
                        <CircularProgressWrapper>
                            <CircularProgress />
                        </CircularProgressWrapper>
                    )}
                </SliderStyled>
            </Drawer>
        );
    }
);

export default Sidebar;
