import React, { useEffect, useState } from 'react';

import { SidebarHeader, SliderTab } from '../../styled/ProjectsPage.styled';
import { Box, Button, IconButton, Tab, Tabs, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { useAuth } from '../../Providers/AuthProvider';
import { IProjects } from '../../types';

interface ISidebarProps {
    projects: IProjects[];
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setDialogAction: React.Dispatch<
        React.SetStateAction<'add' | 'edit' | 'delete'>
    >;
    setSelectedProjectName: React.Dispatch<React.SetStateAction<IProjects>>;
    setSelectedProjectId: React.Dispatch<React.SetStateAction<string>>;
}

const Sidebar = ({
    projects,
    setDialogOpen,
    setDialogAction,
    setSelectedProjectName,
    setSelectedProjectId,
}: ISidebarProps) => {
    const [selectProject, setSelectProject] = useState(0);
    const { isAdmin } = useAuth();

    const handleSelectProject = (
        event: React.SyntheticEvent,
        newProject: number
    ) => {
        setSelectProject(newProject);
    };

    useEffect(() => {
        if (projects && projects[selectProject]?.id) {
            setSelectedProjectId(projects[selectProject].id);
        }
    }, [projects, selectProject, setSelectedProjectId]);

    return (
        <>
            <SidebarHeader>
                <Typography variant="h6">Projects</Typography>
                {isAdmin && (
                    <Button
                        onClick={() => {
                            setDialogOpen(true);
                            setDialogAction('add');
                        }}
                    >
                        <AddIcon />
                    </Button>
                )}
            </SidebarHeader>
            <Tabs
                value={selectProject}
                onChange={handleSelectProject}
                orientation="vertical"
            >
                {projects &&
                    projects.map((project) => (
                        <Tab
                            key={project.id}
                            label={
                                <SliderTab>
                                    <Typography>{project.name}</Typography>
                                    {isAdmin && (
                                        <Box>
                                            <IconButton
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDialogOpen(true);
                                                    setDialogAction('edit');
                                                    setSelectedProjectName({
                                                        name: project.name,
                                                        id: project.id,
                                                    });
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
                                                    setDialogOpen(true);
                                                    setDialogAction('delete');
                                                    setSelectedProjectName({
                                                        name: project.name,
                                                        id: project.id,
                                                    });
                                                }}
                                            >
                                                <DeleteIcon
                                                    fontSize="small"
                                                    color="primary"
                                                />
                                            </IconButton>
                                        </Box>
                                    )}
                                </SliderTab>
                            }
                            onClick={() => setSelectedProjectId(project.id)}
                        />
                    ))}
            </Tabs>
        </>
    );
};

export default Sidebar;
