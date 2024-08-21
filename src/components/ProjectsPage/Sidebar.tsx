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
    setSelectedProjectForUpdate: React.Dispatch<
        React.SetStateAction<IProjects>
    >;
    setSelectedProjectForCreate: React.Dispatch<
        React.SetStateAction<IProjects>
    >;
}

const Sidebar = ({
    projects,
    setDialogOpen,
    setDialogAction,
    setSelectedProjectForUpdate,
    setSelectedProjectForCreate,
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
            setSelectedProjectForCreate({
                id: projects[selectProject].id,
                name: projects[selectProject].name,
            });
        }
    }, [projects, selectProject, setSelectedProjectForCreate]);

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
                                                    setSelectedProjectForUpdate(
                                                        {
                                                            name: project.name,
                                                            id: project.id,
                                                        }
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
                                                    setDialogOpen(true);
                                                    setDialogAction('delete');
                                                    setSelectedProjectForUpdate(
                                                        {
                                                            name: project.name,
                                                            id: project.id,
                                                        }
                                                    );
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
                            onClick={() =>
                                setSelectedProjectForCreate(project)
                            }
                        />
                    ))}
            </Tabs>
        </>
    );
};

export default Sidebar;
