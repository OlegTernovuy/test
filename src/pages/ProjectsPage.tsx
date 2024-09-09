import { useState, useEffect, useCallback } from 'react';

import {
    MenuAudioFormHeaderStyled,
    ProfileBlockStyled,
    ProjectPageHeaderStyled,
    ProjectsPageMainBlock,
} from '../styled/ProjectsPage.styled';
import {
    AudioRecordsTable,
    Sidebar,
    AddAudioRecordForm,
    CustomSelect,
} from '../components';
import { Avatar, Box, Button, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { useAuth } from '../Providers/AuthProvider';
import { useFetchProject } from '../services/Projects.service';
import { useFetchAudioRecords } from '../services/Media.service';
import { IProjects } from '../types';
import { useAudioSettings } from '../Providers/AudioSettingsProvider';

const ProjectsPage = () => {
    const { isAdmin, user, logout } = useAuth();

    const { selectorOutput } = useAudioSettings();

    const [open, setOpen] = useState(true);

    const toggleDrawer = useCallback(() => {
        setOpen((prevOpen) => {
            return !prevOpen;
        });
    }, []);

    //store data about the currently selected project
    const [selectedProjectForCreate, setSelectedProjectForCreate] = useState<{
        id: string;
        name: string;
    }>({
        id: '',
        name: '',
    });

    const {
        data: projects,
        fetchProjects,
        updatedProjects,
    } = useFetchProject();

    const handleReorder = useCallback(
        (reorderedProjects: IProjects[]) => {
            updatedProjects(reorderedProjects);
        },
        [updatedProjects]
    );

    const {
        data: audioRecords,
        fetchAudioRecord,
        loading,
    } = useFetchAudioRecords();

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProjectForCreate.id) {
            fetchAudioRecord(selectedProjectForCreate.id);
        }
    }, [selectedProjectForCreate]);

    return (
        <Box>
            <Sidebar
                projects={projects}
                onReorder={handleReorder}
                setSelectedProjectForCreate={setSelectedProjectForCreate}
                open={open}
                toggleDrawer={toggleDrawer}
                fetchProjects={fetchProjects}
            />
            <ProjectsPageMainBlock $open={open}>
                <ProjectPageHeaderStyled $startItems={isAdmin}>
                    <MenuAudioFormHeaderStyled $startItems={isAdmin}>
                        {!open && (
                            <Button
                                aria-label="show sidebar"
                                onClick={() => toggleDrawer()}
                            >
                                <MenuIcon fontSize="large" />
                            </Button>
                        )}
                        {isAdmin ? (
                            <AddAudioRecordForm
                                author={user.email}
                                project={selectedProjectForCreate.name}
                                projectId={selectedProjectForCreate.id}
                                fetchData={fetchAudioRecord}
                            />
                        ) : (
                            <CustomSelect {...selectorOutput} />
                        )}
                    </MenuAudioFormHeaderStyled>
                    <ProfileBlockStyled>
                        <Typography variant="body2">{user.email}</Typography>
                        <IconButton onClick={logout}>
                            <Avatar>L</Avatar>
                        </IconButton>
                    </ProfileBlockStyled>
                </ProjectPageHeaderStyled>
                <AudioRecordsTable
                    audioRecords={audioRecords}
                    loading={loading}
                    fetchData={fetchAudioRecord}
                    projectId={selectedProjectForCreate}
                />
            </ProjectsPageMainBlock>
        </Box>
    );
};

export default ProjectsPage;
